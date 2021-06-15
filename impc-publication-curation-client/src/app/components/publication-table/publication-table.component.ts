import { FilterService } from "./../../shared/services/filter.service";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { Publication } from "../../shared/models/publication.model";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, SortDirection } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { PublicationService } from "src/app/shared/services/publication.service";
import { merge, of as observableOf } from "rxjs";
import { startWith, switchMap, map, catchError, filter } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Component({
  selector: "impc-publication-table",
  templateUrl: "./publication-table.component.html",
  styleUrls: ["./publication-table.component.scss"],
})
export class PublicationTableComponent implements AfterViewInit, OnInit {
  @ViewChild("paginatorTop", { static: false }) paginatorTop?: MatPaginator;
  @ViewChild("paginatorBottom", { static: false })
  paginatorBottom?: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  @ViewChild(MatTable, { static: false }) table?: MatTable<Publication>;
  sortDirection = "DESC";
  sortable = [
    { value: "firstPublicationDate", viewValue: "Publication date" },
    { value: "title", viewValue: "Title" },
    { value: "authorList", viewValue: "First author" },
    { value: "keyword", viewValue: "Matched keyword" },
    { value: "journal", viewValue: "Journal" },
  ];
  sortActive = this.sortable[0].value;

  isLoadingResults = true;
  notFound = false;

  @Input()
  showActions = false;

  @Input()
  resultsLength = 0;

  @Input()
  status = "";

  tagOptions: Array<string> = [];

  publications: Publication[] = [];

  constructor(
    private publicationService: PublicationService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.publicationService.getConfiguration().subscribe((conf) => {
      this.tagOptions = conf.tags;
    });
  }

  ngAfterViewInit() {
    if (this.sort && this.paginatorTop && this.paginatorBottom) {
      merge(this.sort.sortChange, this.filterService.filterChange).subscribe(
        () => {
          if (this.paginatorBottom && this.paginatorTop) {
            this.paginatorTop.pageIndex = 0;
            this.paginatorBottom.pageIndex = 0;
          }
        }
      );

      merge(
        this.sort.sortChange,
        this.paginatorTop.page,
        this.paginatorBottom.page,
        this.filterService.filterChange,
        this.publicationService.reloadPublications
      )
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.publicationService.getPublications(
              this.paginatorTop?.pageIndex,
              this.paginatorTop?.pageSize,
              { status: this.status, ...this.filterService.filter },
              this.sortActive,
              this.sortDirection
            );
          }),
          map((result) => {
            this.isLoadingResults = false;
            return result;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return observableOf([]);
          })
        )
        .subscribe((data) => {
          this.publications = data;
          this.notFound = this.publications.length === 0;
        });
    }
  }

  syncPaginator(event: any, paginator: MatPaginator, scrolltop: boolean) {
    paginator.pageIndex = event.pageIndex;
    paginator.pageSize = event.pageSize;
    if (scrolltop) {
      this.scrollToTop();
    }
  }

  scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(this.scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };

  changeDirection() {
    this.sortDirection = this.sortDirection === "ASC" ? "DESC" : "ASC";
    this.changeSort();
  }

  changeSort() {
    if (this.sort) {
      this.sort.sortChange.emit({
        active: this.sortActive,
        direction: this.sortDirection as SortDirection,
      });
    }
  }

  downloadCsv() {
    this.publicationService
      .getPublications(0, this.resultsLength, {
        status: this.status,
        ...this.filterService.filter,
      })
      .subscribe((publications) => {
        const csvPublications: Array<any> = [];
        publications.forEach((publication) => {
          const csvPublication: any = {};
          csvPublication.pmid = publication.pmid;
          csvPublication.title = publication.title;
          csvPublication.comments =
            publication.comment == null ? "" : publication.comment;

          publication.alleles.forEach((allele) => {
            const csvRecord = { ...csvPublication };
            csvRecord.allele = allele.alleleSymbol;
            csvRecord.orderId = allele.orderId == null ? "" : allele.orderId;
            csvRecord.emmaId = allele.emmaId == null ? "" : allele.emmaId;
            csvPublications.push(csvRecord);
          });

          if (publication.alleles.length == 0) {
            csvPublication.allele = "";
            csvPublication.orderId = "";
            csvPublication.emmaId = "";
            csvPublications.push(csvPublication);
          }
        });
        const csv = new ngxCsv(csvPublications, `${environment.title} report`, {
          showLabels: true,
          headers: [
            "pmid",
            "title",
            "Comments",
            "allele",
            "Order ID",
            "EMMA ID",
          ],
        });
      });
  }
}

import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import { Allele } from "src/app/shared/models/publication.model";
import { AlleleAutocompleteService } from "src/app/shared/services/allele-autocomplete.service";

@Component({
  selector: "impc-allele-table",
  templateUrl: "./allele-table.component.html",
  styleUrls: ["./allele-table.component.scss"],
})
export class AlleleTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "gacc",
    "geneSymbol",
    "acc",
    "alleleSymbol",
    "alleleName",
  ];
  alleleList: Allele[] = [];
  dataSource = new MatTableDataSource<Allele>(this.alleleList);
  loadingFinished = false;
  tableChanges: Observable<Allele[]> = of([]);
  filterValue = "";

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  filterChange = new BehaviorSubject("");

  constructor(private alleleService: AlleleAutocompleteService) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterChange.next(filterValue.trim().toLowerCase());
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      merge(
        this.sort?.sortChange || of({}),
        this.paginator.page,
        this.filterChange
      )
        .pipe(
          startWith({}),
          switchMap((value) => {
            console.log(value);
            this.loadingFinished = false;
            return this.alleleService.listAlleles(
              this.filterValue,
              this.paginator.pageSize,
              this.paginator.pageIndex
            );
          }),
          map((result) => {
            console.log(result);
            this.loadingFinished = true;
            return result;
          })
        )
        .subscribe((data) => {
          console.log(data);
          this.alleleList = data.content;
          this.paginator.length = data.totalElements;
          this.dataSource = new MatTableDataSource(this.alleleList);
        });
    }
  }
}

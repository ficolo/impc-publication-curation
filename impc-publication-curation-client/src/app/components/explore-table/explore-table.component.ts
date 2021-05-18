import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTable } from "@angular/material/table";
import { Observable, of, BehaviorSubject, merge } from "rxjs";
import { startWith, switchMap, map } from "rxjs/operators";
import { AlleleAutocompleteService } from "src/app/shared/services/allele-autocomplete.service";
import { ExploreService } from "src/app/shared/services/explore.service";

export interface CountByField {
  value: string;
  count: number;
}

@Component({
  selector: "impc-explore-table",
  templateUrl: "./explore-table.component.html",
  styleUrls: ["./explore-table.component.scss"],
})
export class ExploreTableComponent implements AfterViewInit {
  @Input() fieldToVisualize!: string;
  @Input() fieldDisplayName!: string;
  displayedColumns: string[] = ["value", "count"];
  countList: CountByField[] = [];
  dataSource = new MatTableDataSource<CountByField>(this.countList);
  loadingFinished = false;
  tableChanges: Observable<CountByField[]> = of([]);
  filterValue = "";

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  filterChange = new BehaviorSubject("");

  constructor(private exploreService: ExploreService) {}

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
            return this.exploreService.listCounts(
              this.fieldToVisualize,
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
        .subscribe((data: any) => {
          console.log(data);
          this.countList = data.content;
          this.paginator.length = data.totalElements;
          this.dataSource = new MatTableDataSource(this.countList);
        });
    }
  }
}

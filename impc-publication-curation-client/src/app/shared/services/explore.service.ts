import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ExploreService {
  multiValuedPath = "multiple";
  singleValuedPath = "single";

  constructor(private http: HttpClient) {}

  listCounts(
    fieldToVisualize: string,
    filterValue: string,
    pageSize: number,
    pageIndex: number,
    multiValued = true
  ): Observable<any> {
    const requestUrl = `${environment.exploreApiUrl}/${
      multiValued ? this.multiValuedPath : this.singleValuedPath
    }/countBy/${fieldToVisualize}/?page=${pageIndex}&size=${pageSize}${
      filterValue !== "" ? "&text=" + filterValue : ""
    }`;
    return this.http.get<any>(requestUrl).pipe(
      map(({ content, totalElements }) => {
        return { content, totalElements };
      })
    );
  }

  listGroups(
    fieldToVisualize: string,
    filterValue: string,
    pageSize: number,
    pageIndex: number,
    multiValued = true
  ): Observable<any> {
    const requestUrl = `${environment.exploreApiUrl}/${
      multiValued ? this.multiValuedPath : this.singleValuedPath
    }/groupBy/${fieldToVisualize}/?page=${pageIndex}&size=${pageSize}${
      filterValue !== "" ? "&text=" + filterValue : ""
    }`;
    return this.http.get<any>(requestUrl).pipe(
      map(({ content, totalElements }) => {
        return { content, totalElements };
      })
    );
  }
}

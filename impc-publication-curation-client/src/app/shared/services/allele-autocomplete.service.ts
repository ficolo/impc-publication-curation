import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Allele } from "../models/publication.model";

export interface PageResponse {
  content: Array<Allele>;
  count: number;
}

@Injectable()
export class AlleleAutocompleteService {
  allAlleles: Observable<any>;

  constructor(private http: HttpClient) {
    this.allAlleles = of({});
  }

  getAlleles(text: string): Observable<any> {
    let requestUrl = environment.alleleApiUrl + "/" + text;
    if (text !== "") {
      return this.http
        .get(requestUrl)
        .pipe(map((response: any) => response["content"]));
    } else if (this.allAlleles !== null) {
      return this.allAlleles.pipe(map((response) => response["content"]));
    } else {
      this.allAlleles = this.http.get(requestUrl);
      return this.allAlleles.pipe(map((response) => response["content"]));
    }
  }

  listAlleles(text = "", pageSize = 10, pageNumber = 0) {
    const requestUrl = `${environment.alleleApiUrl}${
      text !== "" ? "/" : ""
    }${text}?page=${pageNumber}&size=${pageSize}`;
    return this.http.get<any>(requestUrl).pipe(
      map(({ content, totalElements }) => {
        return { content, totalElements };
      })
    );
  }
}

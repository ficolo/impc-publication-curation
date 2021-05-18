import { Allele, GraphQLResponse } from "./../models/publication.model";
import { Observable, throwError } from "rxjs";
import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, catchError } from "rxjs/operators";
import { Publication } from "../models/publication.model";
import { merge, of as observableOf } from "rxjs";
import { QueryHelper } from "./query.helper.util";
import { Configuration } from "../models/configuration.model";

@Injectable()
export class PublicationService {
  reloadPublications: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  submitPublication = (pmid: string, reference: any) =>
    this.http.post(`${environment.submissionUrl}/${pmid}`, reference);

  getPublications(
    start = 1,
    size = 20,
    filter = {},
    orderByField = "firstPublicationDate",
    orderByDirection = "DESC"
  ): Observable<Publication[]> {
    const queryHelper = new QueryHelper();
    const query = queryHelper.publicationsQuery(
      start,
      size,
      this.parseFilter(filter),
      orderByField,
      orderByDirection
    );
    return this.http
      .post(
        environment.publicationsApiUrl,
        this.constructQuery(query.replace(new RegExp(/\n/, "g"), " "))
      )
      .pipe(
        map((response: any) =>
          response.data.publications.map((publication: Publication) => {
            publication.fragments.forEach((fragment) => {
              fragment.mentions.forEach((mention, index) => {
                fragment.mentions[index] = mention
                  .replace(new RegExp("<", "g"), "&lt;")
                  .replace(new RegExp(">", "g"), "&gt;");
              });
            });
            if (publication.citations && publication.citations.length > 0) {
              publication.citations.forEach((citation) => {
                publication.fragments.push({
                  keyword: citation.pmid,
                  mentions: citation.references,
                });
              });
            }
            if (
              publication.alleleCandidates &&
              publication.alleleCandidates.length > 0
            ) {
              publication.alleleCandidates
                .filter(
                  (candidate) =>
                    !publication.alleles
                      .map((allele) => allele.name)
                      .includes(candidate.name)
                )
                .forEach((alleleCandidate) => {
                  publication.alleles.push({
                    candidate: true,
                    ...alleleCandidate,
                  });
                });
            }
            if (
              !publication.fullTextUrlList ||
              publication.fullTextUrlList.length < 1
            ) {
              publication.fullTextUrlList = [
                {
                  url:
                    "https://www.ncbi.nlm.nih.gov/pubmed/" + publication.pmid,
                },
              ];
            }
            return publication;
          })
        )
      );
  }

  getPublicationsNumber(filter: any): Observable<number> {
    const query = `{ count(${this.parseFilter(filter)}) }`;
    return this.http
      .post(environment.publicationsApiUrl, this.constructQuery(query))
      .pipe(map((result: any) => result.data.count));
  }

  setPublicationStatus(
    pmid: string,
    status = "",
    alleles: Array<Allele> = [],
    consortiumPaper = false,
    comment = ""
  ) {
    let allelesString = "";
    alleles.forEach((allele) => {
      const alleleref: any = Object.assign({}, allele);
      delete alleleref.candidate;
      delete alleleref.id;
      allelesString += `{ ${this.objToString(alleleref)} }, `;
    });
    allelesString =
      "[" + allelesString.substring(0, allelesString.length - 2) + "]";
    const queryHelper = new QueryHelper();
    const query = queryHelper.setStatusQuery(
      pmid,
      status,
      consortiumPaper,
      allelesString,
      comment
    );
    return this.http
      .post(
        environment.publicationsApiUrl,
        this.constructQuery(query.replace(new RegExp(/\n/, "g"), " "))
      )
      .pipe(
        map((result: any) => {
          if (result.error && result.error.message === "Access denied") {
            throwError(result);
          } else {
            this.reloadPublications.emit(true);
          }
        }),
        catchError(() => {
          return observableOf(false);
        })
      );
  }

  getConfiguration(): Observable<Configuration> {
    const queryHelper = new QueryHelper();
    const query = `{ ${queryHelper.configurationQuery()} }`;
    return this.http
      .post(
        environment.publicationsApiUrl,
        this.constructQuery(query.replace(new RegExp(/\n/, "g"), " "))
      )
      .pipe(map((result: any) => result.data.configuration));
  }

  parseFilter(obj: any) {
    let str = "";
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (obj[p] === null || obj[p] === "" || obj[p].length === 0) {
          continue;
        }
        if (p === "provenance") {
          str += obj[p] + ", ";
        } else if (p === "search" || p === "status") {
          str += p + ': \\"' + obj[p] + '\\", ';
        } else if (p !== "keywords") {
          str += p + ": " + obj[p] + ", ";
        } else {
          str += p + ': [\\"' + obj[p].join('\\",\\"') + '\\"], ';
        }
      }
    }
    return str.substring(0, str.length - 2);
  }

  objToString(obj: any) {
    let str = "";
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof obj[p] === "boolean") {
          str += p + ": " + obj[p] + ", ";
        } else {
          str += p + ': \\"' + obj[p] + '\\", ';
        }
      }
    }
    return str.substring(0, str.length - 2);
  }

  constructQuery(queryStr: string) {
    return `{"query":"${queryStr}","variables":null,"operationName":null}`;
  }
}

import { GraphQLResponse } from './../models/publication.model';
import { Observable, throwError } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Publication } from '../models/publication.model';
import { merge, of as observableOf } from 'rxjs';

@Injectable()
export class PublicationService {
  reloadPublications: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  getPublications(
    start = 1,
    size = 20,
    filter = {},
    orderByField = 'firstPublicationDate',
    orderByDirection = 'DESC'
  ): Observable<Publication[]> {
    const query = `{
      publications(start: ${start}, size: ${size}, orderBy: ${orderByField}_${orderByDirection}, ${this.parseFilter(
      filter
    )}){
        title
        authorString
        pmid
        pmcid
        datasource
        falsePositive
        consortiumPaper
        pendingEmailConfirmation
        orderId
        reviewed
        correspondence {
          authors
          emails
        }
        alleles{
          acc
          gacc
          geneSymbol
          project
          alleleName
          alleleSymbol
        }
        fullTextUrlList{
          url
          documentStyle
        }
        grantsList{
          grantId
          agency
        }
        journalInfo{
          dateOfPublication
          journal{
            title
          }
        }
        fragments{
          keyword
          mentions
        }
        cites
        citations {
          pmid
          references
        }
        keyword
        firstPublicationDate
        alleleCandidates {
          acc
          gacc
          geneSymbol
          project
          alleleName
          alleleSymbol
        }
      }
    }`;
    return this.http
      .post(
        environment.publicationsApiUrl,
        this.constructQuery(query.replace(new RegExp(/\n/, 'g'), ' '))
      )
      .pipe(
        map((response: GraphQLResponse) =>
          response.data.publications.map(publication => {
            publication.fragments.forEach(fragment => {
              fragment.mentions.forEach((mention, index) => {
                fragment.mentions[index] = mention
                  .replace(new RegExp('<', 'g'), '&lt;')
                  .replace(new RegExp('>', 'g'), '&gt;');
              });
            });
            if (publication.citations && publication.citations.length > 0) {
              publication.citations.forEach(citation => {
                publication.fragments.push({
                  keyword: citation.pmid,
                  mentions: citation.references
                });
              });
            }
            if (
              publication.alleleCandidates &&
              publication.alleleCandidates.length > 0
            ) {
              publication.alleleCandidates
                .filter(
                  candidate =>
                    !publication.alleles
                      .map(allele => allele.name)
                      .includes(candidate.name)
                )
                .forEach(alleleCandidate => {
                  publication.alleles.push({
                    candidate: true,
                    ...alleleCandidate
                  });
                });
            }
            if (
              !publication.fullTextUrlList ||
              publication.fullTextUrlList.length < 1
            ) {
              publication.fullTextUrlList = [
                {
                  url: 'https://www.ncbi.nlm.nih.gov/pubmed/' + publication.pmid
                }
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
      .pipe(map((result: GraphQLResponse) => result.data.count));
  }

  setPublicationStatus(
    pmid,
    reviewed = false,
    alleles = [],
    falsePositive = false,
    consortiumPaper = false,
    waitingForEmail = false,
    orderId = null
  ) {
    let allelesString = '';
    alleles.forEach(allele => {
      const alleleref = Object.assign({}, allele);
      delete alleleref.candidate;
      delete alleleref.id;
      allelesString += `{ ${this.objToString(alleleref)} }, `;
    });
    allelesString =
      '[' + allelesString.substring(0, allelesString.length - 2) + ']';
    const query = `
  mutation {
    updateReviewed(
    pmid: \\"${pmid}\\",
    reviewed: ${reviewed},
    alleles: ${allelesString},
    falsePositive: ${falsePositive},
    consortiumPaper: ${consortiumPaper},
    pendingEmailConfirmation: ${waitingForEmail},
    orderId: \\"${orderId}\\",
    alleleCandidates: []
    ){
      title
      reviewed
    },
  }`;
    return this.http
      .post(
        environment.publicationsApiUrl,
        this.constructQuery(query.replace(new RegExp(/\n/, 'g'), ' '))
      )
      .pipe(
        map((result: GraphQLResponse) => {
          if (result.error && result.error.message === 'Access denied') {
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

  parseFilter(obj) {
    let str = '';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (obj[p] === null || obj[p] === '' || obj[p].length === 0) {
          continue;
        }
        if (p === 'provenance') {
          str += obj[p] + ', ';
        } else if (p === 'search') {
          str += p + ': \\"' + obj[p] + '\\", ';
        } else if (p !== 'keywords') {
          str += p + ': ' + obj[p] + ', ';
        } else {
          str += p + ': [\\"' + obj[p].join('\\",\\"') + '\\"], ';
        }
      }
    }
    return str.substring(0, str.length - 2);
  }

  objToString(obj) {
    let str = '';
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof obj[p] === 'boolean') {
          str += p + ': ' + obj[p] + ', ';
        } else {
          str += p + ': \\"' + obj[p] + '\\", ';
        }
      }
    }
    return str.substring(0, str.length - 2);
  }

  constructQuery(queryStr) {
    return `{"query":"${queryStr}","variables":null,"operationName":null}`;
  }
}

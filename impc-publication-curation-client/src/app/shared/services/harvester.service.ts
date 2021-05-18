import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HarvesterService {
  constructor(private http: HttpClient) {}

  harvestReference(pmid: string, useAlleles: boolean) {
    return this.http.get(
      `${environment.harvesterUrl}/${pmid}${
        useAlleles ? '?useAlleles=true' : ''
      }`
    );
  }
}

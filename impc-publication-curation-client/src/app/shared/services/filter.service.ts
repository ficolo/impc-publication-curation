import { Injectable, EventEmitter } from '@angular/core';
import { Filter } from 'src/app/components/filter/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterChange: EventEmitter<any> = new EventEmitter();
  searchChange: EventEmitter<any> = new EventEmitter();
  public filter: Filter = {};

  constructor() {}

  emitFilterChange(filter: Filter) {
    this.filter = filter;
    this.filterChange.emit(filter);
  }

  getFilterChange() {
    return this.emitFilterChange;
  }

  changeSearchValue(text: string) {
    this.searchChange.emit(text);
  }
}

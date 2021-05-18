import { FilterService } from './../../shared/services/filter.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Filter } from './filter.model';

@Component({
  selector: 'impc-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input()
  filters: Array<Filter> = [];

  filterForm: FormGroup | undefined;

  constructor(
    private httpClient: HttpClient,
    private filterService: FilterService
  ) {
    const controls: any = {
      search: new FormControl(''),
    };
  }

  ngOnInit(): any {
    const controls: any = {
      search: new FormControl(''),
    };
    this.filters.forEach((filter) => {
      if (filter.type === 'array') {
        controls[filter.field] = new FormControl([]);
      } else if (filter.type === 'range') {
        const from: any = filter.from;
        const to: any = filter.to;
        controls[filter.field + 'From'] = new FormControl(from);
        controls[filter.field + 'To'] = new FormControl(to);
      } else if (filter.type === 'boolean') {
        controls[filter.field] = new FormControl([]);
      }
    });
    this.filters = this.filters.map((filter) => {
      if (filter.url !== undefined) {
        filter.values = this.httpClient.get<Array<any>>(filter.url);
      }
      return filter;
    });
    this.filterForm = new FormGroup(controls);
    this.filterForm.valueChanges.subscribe((value) =>
      this.filterService.emitFilterChange(value)
    );
    this.filterService.searchChange.subscribe((value) =>
      this.filterForm?.controls.search.setValue(value)
    );
  }
}

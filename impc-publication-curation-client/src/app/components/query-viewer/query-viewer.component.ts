import { Component, OnInit, Input } from '@angular/core';
import { Filter } from '../filter/filter.model';

@Component({
  selector: 'impc-query-viewer',
  templateUrl: './query-viewer.component.html',
  styleUrls: ['./query-viewer.component.scss'],
})
export class QueryViewerComponent implements OnInit {
  @Input()
  filters: Array<Filter> = [];

  constructor() {}

  ngOnInit() {}
}

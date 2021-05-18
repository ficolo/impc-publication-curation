import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'impc-keyword-list',
  templateUrl: './keyword-list.component.html',
  styleUrls: ['./keyword-list.component.scss'],
})
export class KeywordListComponent implements OnInit {
  @Input()
  keywords: any[] = [];

  @Output()
  selectedKeyword = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  changeSelection(chip: any) {
    this.keywords.forEach((keyword) => {
      if (chip !== keyword && !chip.selected) {
        keyword.selected = false;
      }
    });
    if (!chip.selected) {
      chip.selected = !chip.selected;
      this.selectedKeyword.next(chip.label);
    }
  }
}

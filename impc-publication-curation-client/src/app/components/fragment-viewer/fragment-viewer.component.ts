import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'impc-fragment-viewer',
  templateUrl: './fragment-viewer.component.html',
  styleUrls: ['./fragment-viewer.component.scss']
})
export class FragmentViewerComponent implements OnInit {

  @Input()
  fragments = [];

  fragmentMap = {};

  keywords = [];

  chips = [];

  selectedFragments = [];


  selectedKeyword = [];

  loading = false;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.fragments.forEach(
      fragment => this.fragmentMap[fragment.keyword] = fragment.mentions
    );
    this.fragmentMap = Object.keys(this.fragmentMap).reduce((r, e) => {
      if (this.fragmentMap[e] && this.fragmentMap[e].length > 0) {
        r[e] = this.fragmentMap[e];
      }
      return r;
    }, {});
    this.chips = Object.keys(this.fragmentMap).map(keyword => ({label: keyword, selected: false, color: 'accent'})).sort(
      (a, b) => this.fragmentMap[b.label].length - this.fragmentMap[a.label].length
    );
    if (this.chips.length > 0) {
      this.chips[0].selected = true;
      this.filter(this.chips[0].label);
    }

    this.keywords = Object.keys(this.fragmentMap);
  }

  filter(keyword) {
    this.selectedKeyword = keyword;
  }

}

import { Component, Input, ElementRef, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'impc-read-more',
  template: `
    <div
      [innerHTML]="currentText | highlightText: keyword:'default'"
      class="read-more"
    ></div>
    <a mat-button *ngIf="!hideToggle" (click)="toggleView()" color="accent"
      >Read {{ isCollapsed ? 'more' : 'less' }}</a
    >
  `,
  styles: [
    `
      .read-more {
        /* These are technically the same, but use both */
        overflow-wrap: break-word;
        word-wrap: break-word;

        -ms-word-break: break-all;
        /* This is the dangerous one in WebKit, as it breaks things wherever */
        word-break: break-all;
        /* Instead use this non-standard one: */
        word-break: break-word;

        /* Adds a hyphen where the word breaks, if supported (No Blink) */
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
      }
    `,
  ],
})
export class ReadMoreComponent implements OnChanges {
  @Input() text = '';
  @Input() keyword = '';
  @Input() maxLength = 100;
  currentText = '';
  hideToggle = true;

  public isCollapsed = true;

  constructor(private elementRef: ElementRef) {}

  toggleView() {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }
  determineView() {
    if (
      !this.text ||
      this.text.replace(/<\/?[^>]+(>|$)/g, '').length <= this.maxLength
    ) {
      this.currentText = this.text;
      this.isCollapsed = false;
      this.hideToggle = true;
      return;
    }
    this.hideToggle = false;
    if (this.isCollapsed === true) {
      this.currentText = this.text.substring(0, this.maxLength) + '...';
    } else if (this.isCollapsed === false) {
      this.currentText = this.text;
    }
  }

  ngOnChanges() {
    this.determineView();
  }
}

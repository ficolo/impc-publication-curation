import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'impc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  copyRightNotice: string = '';

  constructor() {
    this.copyRightNotice = environment.copyRightNotice;
  }

  ngOnInit() {}
}

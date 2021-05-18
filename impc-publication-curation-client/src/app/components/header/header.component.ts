import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { of } from "rxjs";

@Component({
  selector: "impc-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input()
  isLoggedIn = false;

  @Input()
  drawer: any = null;

  @Input()
  baseUrl = "/";

  @Input()
  isHandsetObs = of(false);

  @Output() logout = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  onLogout() {
    this.logout.emit(true);
  }
}

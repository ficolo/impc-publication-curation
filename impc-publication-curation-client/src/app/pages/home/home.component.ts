import { AuthService } from "./../../shared/services/auth.service";
import { FilterService } from "./../../shared/services/filter.service";
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { PublicationService } from "src/app/shared/services/publication.service";
import { environment } from "src/environments/environment";
import { startWith, map, switchMap, filter } from "rxjs/operators";
import { merge } from "rxjs";
import { Filter } from "src/app/components/filter/filter.model";
import { Category } from "src/app/shared/models/category.model";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "impc-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("tabs", { static: false }) tabs: any;
  pendingNumber = 0;
  falsePositiveNumber = 0;
  reviewedNumber = 0;
  categories: Array<Category> = [];
  showActions = false;

  constructor(
    private publicationService: PublicationService,
    private filterService: FilterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.showActions = this.authService.isLoggedIn();
    this.categories = environment.categories;
    this.categories.forEach((category) =>
      merge(
        this.filterService.filterChange,
        this.publicationService.reloadPublications
      )
        .pipe(
          startWith({}),
          switchMap(() =>
            this.getCount({
              status: category.status,
              ...this.filterService.filter,
            })
          )
        )
        .subscribe((count) => {
          category.count = count;
        })
    );
    this.authService.loggedOut.subscribe(() => (this.showActions = false));
  }

  getCount(filter: Filter) {
    return this.publicationService.getPublicationsNumber(filter);
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.tabs.realignInkBar());
  }
}

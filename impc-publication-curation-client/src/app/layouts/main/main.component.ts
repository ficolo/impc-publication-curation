import { FilterService } from "./../../shared/services/filter.service";
import { PublicationAdderComponent } from "./../../components/publication-adder/publication-adder.component";
import { AuthService } from "./../../shared/services/auth.service";
import { environment } from "./../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, share, startWith } from "rxjs/operators";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "impc-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  filters = environment.filters;
  isLoggedIn = false;
  showFilters = true;
  baseUrl = "/";

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedOut.subscribe(() => (this.isLoggedIn = false));
    this.baseUrl = environment.baseUrl;
  }

  logout() {
    this.authService.logout();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PublicationAdderComponent, {
      width: "300px",
      data: { pmid: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return false;
      }
      if (result.status === "failed") {
        this.openSnackBar(
          `There has been an error trying to submit harvest your reference: ${result.error.message}`
        );
        return false;
      }
      if (result.status === "exists") {
        this.openSnackBar("The submitted paper was already in the dataset.");
      }
      if (result.status === "created") {
        this.openSnackBar("The submitted paper was created.");
      }
      this.filterService.changeSearchValue(result.pmid);
      return true;
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", { duration: 2500 });
  }
}

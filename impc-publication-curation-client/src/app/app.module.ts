import { HarvesterService } from "./shared/services/harvester.service";
import { TokenInterceptor } from "./shared/services/interceptor.service";
import { AuthGuard } from "./shared/guards/auth.guard";
import { AuthService } from "./shared/services/auth.service";
import { FilterService } from "./shared/services/filter.service";
import { AlleleAutocompleteService } from "./shared/services/allele-autocomplete.service";
import { KeywordListComponent } from "./components/keyword-list/keyword-list.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainComponent } from "./layouts/main/main.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { HomeComponent } from "./pages/home/home.component";
import { PublicationTableComponent } from "./components/publication-table/publication-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatBadgeModule } from "@angular/material/badge";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PublicationCardComponent } from "./components/publication-card/publication-card.component";
import { FragmentViewerComponent } from "./components/fragment-viewer/fragment-viewer.component";
import { KeepHtmlPipe } from "./shared/pipes/keep-html.pipe";
import { HighlightTextPipe } from "./shared/pipes/highlight-text.pipe";
import { PublicationService } from "./shared/services/publication.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FilterComponent } from "./components/filter/filter.component";
import { AlleleListComponent } from "./components/allele-list/allele-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QueryViewerComponent } from "./components/query-viewer/query-viewer.component";
import { ReadMoreComponent } from "./components/read-more/read-more.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { LoginComponent } from "./pages/login/login.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MatRadioModule } from "@angular/material/radio";
import { PublicationAdderComponent } from "./components/publication-adder/publication-adder.component";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { InfrafrontierAlleleListComponent } from "./components/infrafrontier-allele-list/infrafrontier-allele-list.component";
import { HeaderComponent } from "./components/header/header.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { NoSidebarComponent } from "./layouts/no-sidebar/no-sidebar.component";
import { ExploreComponent } from "./pages/explore/explore.component";
import { AdminHarvestingComponent } from "./components/admin-harvesting/admin-harvesting.component";
import { AdminUsersComponent } from "./components/admin-users/admin-users.component";
import { InputWordListComponent } from "./components/input-word-list/input-word-list.component";
import { AlleleTableComponent } from "./components/allele-table/allele-table.component";
import { TagListComponent } from "./components/tag-list/tag-list.component";
import { MultivalueExplorerComponent } from "./components/multivalue-explorer/multivalue-explorer.component";
import { ExploreTableComponent } from "./components/explore-table/explore-table.component";
import { ExploreBarComponent } from "./components/explore-bar/explore-bar.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ExploreHeatmapComponent } from "./components/explore-heatmap/explore-heatmap.component";
import { HeatMapComponent } from "./components/heatmap/heatmap.component";
import { XAxisComponent } from "./components/x-axis/x-axis.component";
import { ExploreNetworkComponent } from "./components/explore-network/explore-network.component";
import { ExploreLineComponent } from "./components/explore-line/explore-line.component";
import { ExplorePieComponent } from "./components/explore-pie/explore-pie.component";
import { ExploreCollaborationMapComponent } from "./components/explore-collaboration-map/explore-collaboration-map.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    PublicationTableComponent,
    PublicationCardComponent,
    FragmentViewerComponent,
    KeywordListComponent,
    KeepHtmlPipe,
    HighlightTextPipe,
    FilterComponent,
    AlleleListComponent,
    QueryViewerComponent,
    ReadMoreComponent,
    LoginComponent,
    FooterComponent,
    PublicationAdderComponent,
    InfrafrontierAlleleListComponent,
    HeaderComponent,
    AdminComponent,
    NoSidebarComponent,
    ExploreComponent,
    AdminHarvestingComponent,
    AdminUsersComponent,
    InputWordListComponent,
    AlleleTableComponent,
    TagListComponent,
    MultivalueExplorerComponent,
    ExploreTableComponent,
    ExploreBarComponent,
    ExploreHeatmapComponent,
    HeatMapComponent,
    XAxisComponent,
    ExploreNetworkComponent,
    ExploreLineComponent,
    ExplorePieComponent,
    ExploreCollaborationMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatStepperModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatRadioModule,
    MatDialogModule,
    NgxChartsModule,
  ],
  providers: [
    PublicationService,
    AlleleAutocompleteService,
    FilterService,
    AuthService,
    HarvesterService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  entryComponents: [PublicationAdderComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

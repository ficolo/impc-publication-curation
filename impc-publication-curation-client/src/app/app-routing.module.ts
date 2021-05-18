import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { MainComponent } from "./layouts/main/main.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./pages/admin/admin.component";
import { NoSidebarComponent } from "./layouts/no-sidebar/no-sidebar.component";
import { ExploreComponent } from "./pages/explore/explore.component";

const routes: Routes = [
  {
    path: "home",
    component: MainComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
    ],
  },
  {
    path: "admin",
    component: NoSidebarComponent,
    children: [
      {
        path: "",
        component: AdminComponent,
      },
    ],
  },
  {
    path: "explore",
    component: NoSidebarComponent,
    children: [
      {
        path: "",
        component: ExploreComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  { path: "**", redirectTo: "/home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

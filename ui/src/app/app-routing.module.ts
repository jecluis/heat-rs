import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StatsLayoutComponent } from "./layout/stats-layout/stats-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "stats", pathMatch: "full" },
  { path: "stats", component: StatsLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

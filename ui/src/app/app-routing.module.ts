import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StatsLayoutComponent } from "./layout/stats-layout/stats-layout.component";
import { JournalLayoutComponent } from "./layout/journal-layout/journal-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "journal", pathMatch: "full" },
  { path: "stats", component: StatsLayoutComponent },
  { path: "journal", component: JournalLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

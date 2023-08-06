import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { WindowTitlebarComponent } from "./layout/window-titlebar/window-titlebar.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { LogButtonComponent } from "./components/log/log-button/log-button.component";
import { LogWeightModalComponent } from "./components/log/log-weight-modal/log-weight-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GlobalToasterComponent } from "./shared/components/global-toaster/global-toaster.component";
import { StatsLayoutComponent } from "./layout/stats-layout/stats-layout.component";
import { WeightStatsComponent } from "./components/statistics/weight-stats/weight-stats.component";
import { NgxEchartsModule } from "ngx-echarts";

@NgModule({
  declarations: [
    AppComponent,
    WindowTitlebarComponent,
    MainLayoutComponent,
    LogButtonComponent,
    LogWeightModalComponent,
    GlobalToasterComponent,
    StatsLayoutComponent,
    WeightStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

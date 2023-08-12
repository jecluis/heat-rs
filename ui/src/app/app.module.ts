import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WindowTitlebarComponent } from "./layout/window-titlebar/window-titlebar.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { LogButtonComponent } from "./components/log/log-button/log-button.component";
import { LogWeightModalComponent } from "./components/log/log-weight-modal/log-weight-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GlobalToasterComponent } from "./shared/components/global-toaster/global-toaster.component";
import { StatsLayoutComponent } from "./layout/stats-layout/stats-layout.component";
import { WeightStatsComponent } from "./components/statistics/weight-stats/weight-stats.component";
import { NgxEchartsModule } from "ngx-echarts";
import { LogExerciseModalComponent } from "./components/log/log-exercise-modal/log-exercise-modal.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ExerciseStatsComponent } from "./components/statistics/exercise-stats/exercise-stats.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { JournalLayoutComponent } from './layout/journal-layout/journal-layout.component';

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
    LogExerciseModalComponent,
    ExerciseStatsComponent,
    JournalLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

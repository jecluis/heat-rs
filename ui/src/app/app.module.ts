// Copyright 2023 Joao Eduardo Luis <joao@abysmo.io>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
import { JournalLayoutComponent } from "./layout/journal-layout/journal-layout.component";
import { WeightJournalComponent } from './components/journal/weight-journal/weight-journal.component';
import { ExerciseJournalComponent } from './components/journal/exercise-journal/exercise-journal.component';
import { DeletionDialogComponent } from './shared/components/deletion-dialog/deletion-dialog.component';

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
    WeightJournalComponent,
    ExerciseJournalComponent,
    DeletionDialogComponent,
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

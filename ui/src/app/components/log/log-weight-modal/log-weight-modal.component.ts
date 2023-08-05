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

import { Component, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import {
  TauriService,
  WeightJournalEntry,
} from "src/app/shared/services/tauri.service";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
  selector: "heat-log-weight-modal",
  templateUrl: "./log-weight-modal.component.html",
  styleUrls: ["./log-weight-modal.component.scss"],
})
export class LogWeightModalComponent implements OnInit {
  public selectedDate: NgbDateStruct;
  public weight: number;
  public today: NgbDate;

  public weightEntries: string[] = [];

  public constructor(
    public activeModal: NgbActiveModal,
    private calendarSvc: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public toastSvc: ToastService,
    private tauriSvc: TauriService,
  ) {
    this.today = this.calendarSvc.getToday();
    this.selectedDate = this.today;
    this.weight = 0.0;
  }

  public ngOnInit(): void {
    this.tauriSvc
      .getWeightJournal()
      .then((res: WeightJournalEntry[]) => {
        this.weightEntries = res.map((entry: WeightJournalEntry) => entry.date);
      })
      .catch(() => {
        this.toastSvc.showErrorBoom("Unable to obtain weight journal entries!");
      });
  }

  public submit() {
    this.activeModal.close();
    this.tauriSvc
      .logWeight(this.formatter.format(this.selectedDate), this.weight)
      .then((res: boolean) => {
        if (!res) {
          console.error("Unable to log weight!");
          this.toastSvc.showError("Unable to log weight!");
          return;
        }
        this.toastSvc.showSuccess("Weight recorded!", "weight");
      })
      .catch((err) => {
        console.error("Error logging weight: ", err);
        this.toastSvc.showErrorBoom("Error recording weight!");
      });
  }

  public isLogged = (date: NgbDate) =>
    this.weightEntries.filter((v: string) => v === this.formatter.format(date))
      .length > 0;

  public isDisabled = (
    date: NgbDate,
    current?: { year: number; month: number },
  ) => date > this.today || this.isLogged(date);

  public extraTemplateData = (
    date: NgbDate,
    current?: { year: number; month: number },
  ) => ({ logged: this.isLogged(date) });
}

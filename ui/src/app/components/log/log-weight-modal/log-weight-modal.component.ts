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

import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { WeightJournalService } from "src/app/shared/services/journal/weight-journal.service";
import { WeightJournalEntry } from "src/app/shared/services/tauri.service";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
  selector: "heat-log-weight-modal",
  templateUrl: "./log-weight-modal.component.html",
  styleUrls: ["./log-weight-modal.component.scss"],
})
export class LogWeightModalComponent implements OnInit, OnDestroy {
  public selectedDate: NgbDateStruct;
  public weight: number;
  public today: NgbDate;

  public weightEntries: string[] = [];

  private journalSubscription?: Subscription;

  public constructor(
    public activeModal: NgbActiveModal,
    private calendarSvc: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public toastSvc: ToastService,
    private journalSvc: WeightJournalService,
  ) {
    this.today = this.calendarSvc.getToday();
    this.selectedDate = this.today;
    this.weight = 0.0;
  }

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (res: WeightJournalEntry[]) => {
        this.weightEntries = res.map((entry: WeightJournalEntry) => entry.date);
      },
    });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }

  public submit() {
    this.activeModal.close();
    this.journalSvc.logWeight(
      this.formatter.format(this.selectedDate),
      this.weight,
    );
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

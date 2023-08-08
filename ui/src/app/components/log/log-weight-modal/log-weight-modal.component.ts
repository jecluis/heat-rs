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
  BsDatepickerConfig,
  DatepickerDateCustomClasses,
} from "ngx-bootstrap/datepicker";
import { BsModalRef } from "ngx-bootstrap/modal";
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
  public selectedDate: Date;
  public weight: number;
  public today: Date;

  public calendarConfig: Partial<BsDatepickerConfig>;

  public existingEntries: DatepickerDateCustomClasses[] = [];
  public disabledDates: Date[] = [];

  private journalSubscription?: Subscription;

  public constructor(
    public modalRef: BsModalRef,
    public toastSvc: ToastService,
    private journalSvc: WeightJournalService,
  ) {
    this.today = new Date();
    this.selectedDate = this.today;
    this.weight = 0.0;

    this.calendarConfig = { dateInputFormat: "YYY-MM-DD" };
  }

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (res: WeightJournalEntry[]) => {
        this.existingEntries = res.map((entry: WeightJournalEntry) => {
          let d = new Date(entry.date);
          this.disabledDates.push(d);
          return {
            date: d,
            classes: ["bg-success", "text-light"],
          };
        });
      },
    });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }

  public submit() {
    this.modalRef.hide();
    this.journalSvc.logWeight(this.selectedDate.toISOString(), this.weight);
  }
}

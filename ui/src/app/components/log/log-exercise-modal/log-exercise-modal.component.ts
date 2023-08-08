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
import { ExerciseJournalService } from "src/app/shared/services/journal/exercise-journal.service";
import { ExerciseJournalEntry } from "src/app/shared/services/tauri.service";

const exercises = ["rowing", "running", "functional", "padel", "walking"];

@Component({
  selector: "heat-log-exercise-modal",
  templateUrl: "./log-exercise-modal.component.html",
  styleUrls: ["./log-exercise-modal.component.scss"],
})
export class LogExerciseModalComponent implements OnInit, OnDestroy {
  public today: Date;
  public selectedDate: Date;
  public exerciseType: number;
  public exerciseCalories: number;
  public exerciseMinutes: number;

  public calendarConfig: Partial<BsDatepickerConfig>;

  public exercises: string[] = [];
  public existingEntries: DatepickerDateCustomClasses[] = [];
  public disabledDates: Date[] = [];
  private journalSubscription?: Subscription;

  public constructor(
    public modalRef: BsModalRef,
    private journalSvc: ExerciseJournalService,
  ) {
    this.today = new Date();
    this.selectedDate = this.today;
    this.exerciseType = -1;
    this.exerciseCalories = 0;
    this.exerciseMinutes = 0;

    this.calendarConfig = {
      dateInputFormat: "YYYY-MM-DD @ HH:mm",
      keepDatesOutOfRules: true,
      withTimepicker: true,
      keepDatepickerOpened: true,
    };
  }

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (res: ExerciseJournalEntry[]) => {
        this.existingEntries = res.map((entry: ExerciseJournalEntry) => {
          let d = new Date(entry.date);
          this.disabledDates.push(d);
          return {
            date: d,
            classes: ["bg-success", "text-light"],
          };
        });
      },
    });

    this.journalSvc
      .getExerciseTypes()
      .then((res: string[]) => (this.exercises = res))
      .catch(() => {
        console.error("Unable to obtain exercise types list!");
      });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }

  public submit() {
    this.modalRef.hide();
    this.journalSvc.logExercise(
      this.selectedDate.toISOString(),
      exercises[this.exerciseType],
      this.exerciseCalories,
      this.exerciseMinutes,
    );
  }
}

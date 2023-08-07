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
import { FormsModule } from "@angular/forms";
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
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
  public today: NgbDate;
  public selectedDate: NgbDateStruct;
  public exerciseTime: NgbTimeStruct;
  public exerciseType: number;
  public exerciseCalories: number;
  public exerciseMinutes: number;

  public exercises: string[] = [];
  public journalEntries: string[] = [];
  private journalSubscription?: Subscription;

  public constructor(
    public activeModal: NgbActiveModal,
    private calendarSvc: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private journalSvc: ExerciseJournalService,
  ) {
    this.today = this.calendarSvc.getToday();
    this.selectedDate = this.today;
    this.exerciseTime = { hour: 1, minute: 0, second: 0 };
    this.exerciseType = -1;
    this.exerciseCalories = 0;
    this.exerciseMinutes = 0;
  }

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (res: ExerciseJournalEntry[]) => {
        this.journalEntries = res.map(
          (entry: ExerciseJournalEntry) => entry.date,
        );
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
    this.activeModal.close();
    this.journalSvc.logExercise(
      this.formatter.format(this.selectedDate),
      exercises[this.exerciseType],
      this.exerciseCalories,
      this.exerciseMinutes,
    );
  }

  public isCalendarEntryLogged = (date: NgbDate) =>
    this.journalEntries.filter((v: string) => v === this.formatter.format(date))
      .length > 0;

  public isCalendarEntryDisabled = (
    date: NgbDate,
    current?: { year: number; month: number },
  ) => date > this.today || this.isCalendarEntryLogged(date);

  public extraCalendarEntryData = (
    date: NgbDate,
    current?: { year: number; month: number },
  ) => ({ logged: this.isCalendarEntryLogged(date) });
}

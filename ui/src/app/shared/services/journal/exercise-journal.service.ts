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

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  ExerciseJournalEntry,
  ExerciseJournalParams,
  TauriService,
} from "../tauri.service";
import { ToastService } from "../toast.service";

@Injectable({
  providedIn: "root",
})
export class ExerciseJournalService {
  private journalSubject = new BehaviorSubject<ExerciseJournalEntry[]>([]);

  public constructor(
    private tauriSvc: TauriService,
    private toastSvc: ToastService,
  ) {
    this.update();
  }

  private update() {
    this.tauriSvc
      .getExerciseJournal()
      .then((res) => {
        this.journalSubject.next(res);
      })
      .catch(() => {
        this.toastSvc.showErrorBoom("Error updating exercise journal");
      });
  }

  public logExercise(exercise_params: ExerciseJournalParams) {
    this.tauriSvc
      .logExercise(exercise_params)
      .then((res: boolean) => {
        if (!res) {
          console.error("Unable to log exercise!");
          this.toastSvc.showError("Unable to log exercise!");
          return;
        }
        this.toastSvc.showSuccess("Exercise recorded!", "weight-lifter");
        this.update();
      })
      .catch((err) => {
        console.error("Error logging exercise: ", err);
        this.toastSvc.showErrorBoom("Error recording exercise!");
      });
  }

  public getExerciseTypes(): Promise<string[]> {
    return this.tauriSvc.getExerciseTypes();
  }

  public deleteEntry(entry: ExerciseJournalEntry) {
    this.tauriSvc
      .deleteExerciseJournalEntry(entry.id)
      .then((res: boolean) => {
        if (!res) {
          console.error(`Unable to delete exercise entry id '${entry.id}'!`);
          this.toastSvc.showError("Unable to delete exercise entry!");
          return;
        }
        this.toastSvc.showSuccess("Exercise entry deleted!", "weight-lifter");
        this.update();
      })
      .catch((err) => {
        console.error("Error deleting exercise: ", err);
        this.toastSvc.showErrorBoom("Error deleting exercise entry!");
      });
  }

  public get journal(): BehaviorSubject<ExerciseJournalEntry[]> {
    return this.journalSubject;
  }
}

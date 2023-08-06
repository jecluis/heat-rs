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
import { TauriService, WeightJournalEntry } from "../tauri.service";
import { ToastService } from "../toast.service";

@Injectable({
  providedIn: "root",
})
export class WeightJournalService {
  private journalSubject = new BehaviorSubject<WeightJournalEntry[]>([]);

  public constructor(
    private tauriSvc: TauriService,
    private toastSvc: ToastService,
  ) {
    this.update();
  }

  private update() {
    this.tauriSvc
      .getWeightJournal()
      .then((res) => {
        this.journalSubject.next(res);
      })
      .catch(() => {
        this.toastSvc.showErrorBoom("Error updating weight journal");
      });
  }

  public logWeight(date: string, value: number) {
    this.tauriSvc
      .logWeight(date, value)
      .then((res: boolean) => {
        if (!res) {
          console.error("Unable to log weight!");
          this.toastSvc.showError("Unable to log weight!");
          return;
        }
        this.toastSvc.showSuccess("Weight recorded!", "weight");
        this.update();
      })
      .catch((err) => {
        console.error("Error logging weight: ", err);
        this.toastSvc.showErrorBoom("Error recording weight!");
      });
  }

  public get journal(): BehaviorSubject<WeightJournalEntry[]> {
    return this.journalSubject;
  }
}

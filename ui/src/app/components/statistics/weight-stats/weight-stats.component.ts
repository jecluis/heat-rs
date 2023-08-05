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
import { Subscription, interval } from "rxjs";
import {
  TauriService,
  WeightJournalEntry,
} from "src/app/shared/services/tauri.service";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
  selector: "heat-weight-stats",
  templateUrl: "./weight-stats.component.html",
  styleUrls: ["./weight-stats.component.scss"],
})
export class WeightStatsComponent implements OnInit, OnDestroy {
  public weightEntries: WeightJournalEntry[] = [];

  private intervalSubscription?: Subscription;

  public constructor(
    private tauriSvc: TauriService,
    private toastSvc: ToastService,
  ) {}

  public ngOnInit(): void {
    this.intervalSubscription = interval(1000).subscribe({
      next: () => {
        this.updateList();
      },
    });
  }

  public ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
  }

  private updateList() {
    this.tauriSvc
      .getWeightJournal()
      .then((res) => {
        this.weightEntries = res;
      })
      .catch(() => {
        this.toastSvc.showErrorBoom("Error obtaining weight journal");
        this.intervalSubscription?.unsubscribe();
      });
  }
}

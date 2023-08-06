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
import { Subscription } from "rxjs";
import { WeightJournalService } from "src/app/shared/services/journal/weight-journal.service";
import { WeightJournalEntry } from "src/app/shared/services/tauri.service";

@Component({
  selector: "heat-weight-stats",
  templateUrl: "./weight-stats.component.html",
  styleUrls: ["./weight-stats.component.scss"],
})
export class WeightStatsComponent implements OnInit, OnDestroy {
  public weightEntries: WeightJournalEntry[] = [];

  private journalSubscription?: Subscription;

  public constructor(private journalSvc: WeightJournalService) {}

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (entries: WeightJournalEntry[]) => {
        this.weightEntries = entries;
      },
    });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }
}

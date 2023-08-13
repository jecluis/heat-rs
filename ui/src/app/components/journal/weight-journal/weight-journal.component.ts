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
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";
import { DeletionDialogComponent } from "src/app/shared/components/deletion-dialog/deletion-dialog.component";
import { WeightJournalService } from "src/app/shared/services/journal/weight-journal.service";
import { WeightJournalEntry } from "src/app/shared/services/tauri.service";

@Component({
  selector: "heat-weight-journal",
  templateUrl: "./weight-journal.component.html",
  styleUrls: ["./weight-journal.component.scss"],
})
export class WeightJournalComponent implements OnInit, OnDestroy {
  public entries: WeightJournalEntry[] = [];

  private journalSubscription?: Subscription;
  private deletionModalRef?: BsModalRef;
  private deletionSubscription?: Subscription;

  public constructor(
    private journalSvc: WeightJournalService,
    private modalSvc: BsModalService,
  ) {}

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (entries: WeightJournalEntry[]) => {
        this.entries = entries;
      },
    });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
    this.deletionModalRef?.hide();
    this.deletionSubscription?.unsubscribe();
  }

  public deleteEntry(entry: WeightJournalEntry) {
    if (!!this.deletionModalRef) {
      return;
    }

    this.deletionModalRef = this.modalSvc.show(DeletionDialogComponent, {
      initialState: {
        entryName: entry.date,
      },
    });
    this.deletionSubscription = this.deletionModalRef.content.onClose.subscribe(
      (result: boolean) => {
        if (result) {
          this.journalSvc.deleteEntry(entry);
        }
        this.deletionSubscription?.unsubscribe();
        this.deletionSubscription = undefined;
        this.deletionModalRef = undefined;
      },
    );
  }
}

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
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";
import { DeletionDialogComponent } from "src/app/shared/components/deletion-dialog/deletion-dialog.component";
import { ExerciseJournalService } from "src/app/shared/services/journal/exercise-journal.service";
import { ExerciseJournalEntry } from "src/app/shared/services/tauri.service";

@Component({
  selector: "heat-exercise-journal",
  templateUrl: "./exercise-journal.component.html",
  styleUrls: ["./exercise-journal.component.scss"],
})
export class ExerciseJournalComponent implements OnInit, OnDestroy {
  public entries: ExerciseJournalEntry[] = [];

  private journalSubscription?: Subscription;
  private deletionModalRef?: BsModalRef;
  private deletionSubscription?: Subscription;

  public constructor(
    private journalSvc: ExerciseJournalService,
    private modalSvc: BsModalService,
  ) {}

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (entries: ExerciseJournalEntry[]) => {
        this.entries = entries.reverse();
      },
    });
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
    this.deletionModalRef?.hide();
    this.deletionSubscription?.unsubscribe();
  }

  public deleteEntry(entry: ExerciseJournalEntry) {
    if (!!this.deletionModalRef) {
      return;
    }

    let dt = moment(entry.datetime);
    let when = dt.format("YYYY-MM-DD") + " at " + dt.format("HH:mm");

    this.deletionModalRef = this.modalSvc.show(DeletionDialogComponent, {
      initialState: {
        entryName: `${entry.exercise} on ${when}`,
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

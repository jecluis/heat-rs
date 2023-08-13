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
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "heat-deletion-dialog",
  templateUrl: "./deletion-dialog.component.html",
  styleUrls: ["./deletion-dialog.component.scss"],
})
export class DeletionDialogComponent implements OnInit, OnDestroy {
  public onClose: Subject<boolean> = new Subject();
  public entryName?: string;

  private hiddenSubscription?: Subscription;

  public constructor(private modalRef: BsModalRef) {}

  public ngOnInit(): void {
    this.hiddenSubscription = this.modalRef.onHide?.subscribe(
      (reason: string | any) => {
        if (!!reason && reason === "backdrop-click") {
          this.onClose.next(false);
        }
      },
    );
  }

  public ngOnDestroy(): void {
    this.hiddenSubscription?.unsubscribe();
  }

  public cancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }
  public confirm() {
    this.onClose.next(true);
    this.modalRef.hide();
  }
}

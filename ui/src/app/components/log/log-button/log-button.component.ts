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

import { Component } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { LogWeightModalComponent } from "../log-weight-modal/log-weight-modal.component";
import { LogExerciseModalComponent } from "../log-exercise-modal/log-exercise-modal.component";

@Component({
  selector: "heat-log-button",
  templateUrl: "./log-button.component.html",
  styleUrls: ["./log-button.component.scss"],
})
export class LogButtonComponent {
  public constructor(private modalSvc: BsModalService) {}

  public openLogWeight() {
    this.modalSvc.show(LogWeightModalComponent, { animated: true });
  }

  public openLogExercise() {
    this.modalSvc.show(LogExerciseModalComponent);
  }
}

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
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
  selector: "heat-log-weight-modal",
  templateUrl: "./log-weight-modal.component.html",
  styleUrls: ["./log-weight-modal.component.scss"],
})
export class LogWeightModalComponent {
  public selectedDate: NgbDateStruct;
  public weight: number;

  public constructor(
    public activeModal: NgbActiveModal,
    private calendarSvc: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public toastSvc: ToastService,
  ) {
    this.selectedDate = this.calendarSvc.getToday();
    this.weight = 0.0;
  }

  public submit() {
    // TODO(joao): store the values somewhere
    this.activeModal.close();
    this.toastSvc.showSuccess("Weight recorded!", "weight");
  }
}

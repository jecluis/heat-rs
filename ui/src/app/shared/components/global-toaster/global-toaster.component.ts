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

import { Component, TemplateRef } from "@angular/core";
import { ToastEntry, ToastService } from "../../services/toast.service";

@Component({
  selector: "heat-global-toaster",
  templateUrl: "./global-toaster.component.html",
  styleUrls: ["./global-toaster.component.scss"],
  host: {
    class: "toast-container position-fixed top-0 end-0 pe-2",
    style: "z-index: 1200; padding-top: 120px",
  },
})
export class GlobalToasterComponent {
  public constructor(public toastSvc: ToastService) {}

  public isTemplate(toast: ToastEntry) {
    return toast.textOrTpl instanceof TemplateRef;
  }

  public getTemplate(toast: ToastEntry): TemplateRef<any> {
    return toast.textOrTpl as TemplateRef<any>;
  }
}

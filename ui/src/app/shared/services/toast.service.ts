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
//
// some code initially based on ng-bootstrap's documentation (CC-BY-3.0).

import { Injectable, TemplateRef } from "@angular/core";

export type ToastOptions = {
  type: string;
  classname?: string;
  delay?: number;
  icon?: string;
};

export type ToastEntry = {
  textOrTpl: string | TemplateRef<any>;
} & ToastOptions;

@Injectable({
  providedIn: "root",
})
export class ToastService {
  public toasts: ToastEntry[] = [];

  public constructor() {}

  public show(
    textOrTpl: string | TemplateRef<any>,
    options: ToastOptions = { type: "info" },
  ) {
    this.toasts.push({ textOrTpl, ...options });
  }

  public remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  public clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  public showSuccess(text: string, icon: string | undefined = undefined) {
    this.show(text, {
      type: "success",
      delay: 3000,
      icon: icon,
    });
  }

  public showErrorBoom(text: string) {
    this.show(text, {
      type: "danger",
      delay: 5000,
      icon: "virus-outline",
    });
  }

  public showError(text: string) {
    this.show(text, {
      type: "danger",
      delay: 5000,
      icon: "alert-circle-outline",
    });
  }
}

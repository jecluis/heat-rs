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
import { appWindow } from "@tauri-apps/api/window";

@Component({
  selector: "heat-window-titlebar",
  templateUrl: "./window-titlebar.component.html",
  styleUrls: ["./window-titlebar.component.scss"],
})
export class WindowTitlebarComponent {
  public minimize() {
    appWindow.minimize();
  }

  public maximize() {
    appWindow.toggleMaximize();
  }

  public close() {
    appWindow.close();
  }
}

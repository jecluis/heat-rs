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

import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api";
import { getVersion as tauriGetVersion } from "@tauri-apps/api/app";

@Injectable({
  providedIn: "root",
})
export class TauriService {
  public constructor() {}

  public async getVersion(): Promise<string> {
    return await tauriGetVersion();
  }

  public async logWeight(date: string, value: number): Promise<void> {}
}

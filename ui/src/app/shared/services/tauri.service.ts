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

export type WeightJournalEntry = {
  id: number;
  date: string;
  value: number;
};

export type ExerciseJournalEntry = {
  id: number;
  datetime: string;
  exercise: string;
  calories: number;
  duration: number;
  bpm: {
    max: number;
    avg: number;
  };
};

export type ExerciseJournalParams = {
  when: Date;
  type: string;
  calories: number;
  duration: {
    total: number;
    light: number;
    intense: number;
    aerobic: number;
    anaerobic: number;
  };
  bpm: {
    max: number;
    avg: number;
  };
  distance: number;
  what: {
    steps: number;
    strokes: number;
  };
};

export type HeatPaths = {
  data: string;
  config: string;
  db_path: string;
  is_custom_path: boolean;
};

@Injectable({
  providedIn: "root",
})
export class TauriService {
  public constructor() {}

  public async getVersion(): Promise<string> {
    return await tauriGetVersion();
  }

  public async logWeight(date: string, value: number): Promise<boolean> {
    return invoke("journal_weight", {
      date,
      value,
    });
  }

  public async hasWeight(date: string): Promise<boolean> {
    return invoke("journal_has_weight", { date });
  }

  public async getWeightJournal(): Promise<WeightJournalEntry[]> {
    return invoke("get_weight_journal");
  }

  public async deleteWeightJournalEntry(date: string): Promise<boolean> {
    return invoke("delete_weight_journal_entry", { date });
  }

  public async logExercise(params: ExerciseJournalParams): Promise<boolean> {
    return invoke("journal_exercise", { params });
  }

  public async getExerciseJournal(): Promise<ExerciseJournalEntry[]> {
    return invoke("get_exercise_journal");
  }

  public async deleteExerciseJournalEntry(id: number): Promise<boolean> {
    return invoke("delete_exercise_journal_entry", { id });
  }

  public async getExerciseTypes(): Promise<string[]> {
    return invoke("get_exercise_types");
  }

  public async getPaths(): Promise<HeatPaths> {
    return invoke("get_paths");
  }
}

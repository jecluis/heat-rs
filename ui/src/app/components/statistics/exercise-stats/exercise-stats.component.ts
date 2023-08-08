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

import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { Subscription } from "rxjs";
import { ExerciseJournalService } from "src/app/shared/services/journal/exercise-journal.service";
import { ExerciseJournalEntry } from "src/app/shared/services/tauri.service";

type ChartData = {
  name: string;
  value: [string, number];
};

@Component({
  selector: "heat-exercise-stats",
  templateUrl: "./exercise-stats.component.html",
  styleUrls: ["./exercise-stats.component.scss"],
})
export class ExerciseStatsComponent implements OnInit, OnDestroy {
  @Input("type")
  public chartType?: string;

  public exerciseEntries: ExerciseJournalEntry[] = [];
  public chartOptions!: EChartsOption;
  public chartUpdateOptions!: EChartsOption;
  public chartData: ChartData[] = [];

  private journalSubscription?: Subscription;

  public constructor(private journalSvc: ExerciseJournalService) {}

  public ngOnInit(): void {
    if (!this.chartType) {
      console.error("Chart type not set!");
      return;
    }

    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (entries: ExerciseJournalEntry[]) => {
        if (!this.chartType) {
          console.error("Chart type not set!");
          return;
        }

        this.exerciseEntries = entries;
        this.chartData = [];
        this.exerciseEntries.forEach((entry: ExerciseJournalEntry) => {
          let value = 0;
          if (this.chartType! === "duration") {
            value = entry.duration;
          } else if (this.chartType! === "calories") {
            value = entry.calories;
          }

          this.chartData.push({
            name: entry.datetime,
            value: [entry.datetime, value],
          });
        });
        this.chartUpdateOptions = {
          series: [{ data: this.chartData }],
        };
        console.log(`chart(${this.chartType}) data:`, this.chartData);
      },
    });

    let chartTitle = "N/A";
    let chartUnit = "N/A";
    if (this.chartType! === "duration") {
      chartTitle = "Exercise Duration";
      chartUnit = "min";
    } else if (this.chartType! === "calories") {
      chartTitle = "Calories Spent";
      chartUnit = "kcal";
    }

    this.chartOptions = {
      title: {
        text: chartTitle,
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          let params_arr: DefaultLabelFormatterCallbackParams[] =
            params as DefaultLabelFormatterCallbackParams[];
          let params_entry = params_arr[0];
          let value_arr = params_entry.value as any[];
          const date = new Date(params_entry.name);
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " : " +
            Math.round((value_arr[1] + Number.EPSILON) * 100) / 100 +
            " " +
            chartUnit
          );
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: chartTitle,
          type: "bar",
          data: this.chartData,
        },
      ],
    };
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }
}

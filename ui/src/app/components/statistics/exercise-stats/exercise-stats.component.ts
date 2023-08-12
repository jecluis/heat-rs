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
import * as moment from "moment";

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

  private exerciseChartData: ChartData[] = [];
  private bpmMaxChartData: ChartData[] = [];
  private bpmAvgChartData: ChartData[] = [];

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
        this.exerciseChartData = [];
        this.bpmMaxChartData = [];
        this.bpmAvgChartData = [];
        this.exerciseEntries.forEach((entry: ExerciseJournalEntry) => {
          let value = 0;
          if (this.chartType! === "duration") {
            value = entry.duration;
          } else if (this.chartType! === "calories") {
            value = entry.calories;
          }

          let dtStr = moment(entry.datetime).format("YYYY-MM-DD");
          this.exerciseChartData.push({
            name: dtStr,
            value: [entry.datetime, value],
          });
          this.bpmMaxChartData.push({
            name: dtStr,
            value: [entry.datetime, entry.bpm.max],
          });
          this.bpmAvgChartData.push({
            name: dtStr,
            value: [entry.datetime, entry.bpm.avg],
          });
        });
        this.chartUpdateOptions = {
          series: [
            { data: this.exerciseChartData },
            { data: this.bpmMaxChartData },
            { data: this.bpmAvgChartData },
          ],
        };
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
        axisPointer: {
          type: "cross",
          animation: false,
        },
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          name: chartUnit,
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
          },
        },
        {
          name: "bpm",
          type: "value",
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#EE6666",
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: chartTitle,
          type: "bar",
          yAxisIndex: 0,
          data: this.exerciseChartData,
        },
        {
          name: "Max Beats Per Minute",
          type: "line",
          yAxisIndex: 1,
          data: this.bpmMaxChartData,
          color: "#EE6666",
        },
        {
          name: "Average Beats Per Minute",
          type: "line",
          yAxisIndex: 1,
          data: this.bpmAvgChartData,
          color: "orange",
        },
      ],
    };
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }
}

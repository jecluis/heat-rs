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
import {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { Subscription } from "rxjs";
import { WeightJournalService } from "src/app/shared/services/journal/weight-journal.service";
import { WeightJournalEntry } from "src/app/shared/services/tauri.service";

type ChartData = {
  name: string;
  value: [string, number];
};

@Component({
  selector: "heat-weight-stats",
  templateUrl: "./weight-stats.component.html",
  styleUrls: ["./weight-stats.component.scss"],
})
export class WeightStatsComponent implements OnInit, OnDestroy {
  public weightEntries: WeightJournalEntry[] = [];
  public chartOptions!: EChartsOption;
  public chartUpdateOptions!: EChartsOption;
  public chartData: ChartData[] = [];

  private journalSubscription?: Subscription;

  public constructor(private journalSvc: WeightJournalService) {}

  public ngOnInit(): void {
    this.journalSubscription = this.journalSvc.journal.subscribe({
      next: (entries: WeightJournalEntry[]) => {
        this.weightEntries = entries;
        this.chartData = [];
        this.weightEntries.forEach((entry: WeightJournalEntry) => {
          this.chartData.push({
            name: entry.date,
            value: [entry.date.replace("-", "/"), entry.value],
          });
        });
        this.chartUpdateOptions = {
          series: [{ data: this.chartData }],
        };
      },
    });

    this.chartOptions = {
      title: {
        text: "Weight",
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
            " Kg"
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
          name: "Weight",
          type: "line",
          showSymbol: false,
          data: this.chartData,
        },
      ],
    };
  }

  public ngOnDestroy(): void {
    this.journalSubscription?.unsubscribe();
  }
}

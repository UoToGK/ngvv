import { Component, OnDestroy } from '@angular/core';
import { DyThemeService, DyColorHelper } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-chartjs-radar',
  template: `
    <chart type="radar" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsRadarComponent implements OnDestroy {
  options: any;
  data: {};
  themeSubscription: any;

  constructor(private theme: DyThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: ['吃', '饮酒', '睡觉', '设计', '编码', '骑自行车', '跑步'],
        datasets: [{
          data: [65, 59, 90, 81, 56, 55, 40],
          label: '系列 A',
          borderColor: colors.danger,
          backgroundColor: DyColorHelper.hexToRgbA(colors.dangerLight, 0.5),
        }, {
          data: [28, 48, 40, 19, 96, 27, 100],
          label: '系列 B',
          borderColor: colors.warning,
          backgroundColor: DyColorHelper.hexToRgbA(colors.warningLight, 0.5),
        }],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        scaleFontColor: 'white',
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scale: {
          pointLabels: {
            fontSize: 14,
            fontColor: chartjs.textColor,
          },
          gridLines: {
            color: chartjs.axisLineColor,
          },
          angleLines: {
            color: chartjs.axisLineColor,
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

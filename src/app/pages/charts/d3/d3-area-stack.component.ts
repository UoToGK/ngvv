import { Component, OnDestroy } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-d3-area-stack',
  template: `
    <ngx-charts-area-chart
      [scheme]="colorScheme"
      [results]="multi"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [autoScale]="autoScale">
    </ngx-charts-area-chart>
  `,
})
export class D3AreaStackComponent implements OnDestroy {
  multi = [{
    name: '德国',
    series: [{
        name: '2010',
        value: 7300000,
      }, {
        name: '2011',
        value: 8940000,
      }],
  }, {
    name: '美国',
    series: [{
        name: '2010',
        value: 7870000,
      }, {
        name: '2011',
        value: 8270000,
      }],
  }, {
    name: '法国',
    series: [{
        name: '2010',
        value: 5000002,
      }, {
        name: '2011',
        value: 5800000,
      }],
  }];
  showLegend = true;
  autoScale = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = '国家';
  yAxisLabel = '人口';
  colorScheme: any;
  themeSubscription: any;

  constructor(private theme: DyThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

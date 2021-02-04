import { Component, OnDestroy } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-d3-polar',
  template: `
    <ngx-charts-polar-chart
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
    </ngx-charts-polar-chart>
  `,
})
export class D3PolarComponent implements OnDestroy {
  multi = [
    {
      name: '德国',
      series: [
        {
          name: '1990',
          value: 31476,
        },
        {
          name: '2000',
          value: 36953,
        },
        {
          name: '2010',
          value: 40632,
        },
      ],
    },
    {
      name: '美国',
      series: [
        {
          name: '1990',
          value: 37060,
        },
        {
          name: '2000',
          value: 45986,
        },
        {
          name: '2010',
          value: 49737,
        },
      ],
    },
    {
      name: '法国',
      series: [
        {
          name: '1990',
          value: 29476,
        },
        {
          name: '2000',
          value: 34774,
        },
        {
          name: '2010',
          value: 36240,
        },
      ],
    },
  ];
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

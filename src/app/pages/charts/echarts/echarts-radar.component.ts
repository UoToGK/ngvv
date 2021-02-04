import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-echarts-radar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsRadarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: DyThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.warning],
        tooltip: {},
        legend: {
          data: ['分配预算', '实际支出'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        radar: {
          name: {
            textStyle: {
              color: echarts.textColor,
            },
          },
          indicator: [
            { name: '销售额', max: 6500 },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客户支持', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '营销', max: 25000 },
          ],
          splitArea: {
            areaStyle: {
              color: 'transparent',
            },
          },
        },
        series: [
          {
            name: '预算与支出',
            type: 'radar',
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: '分配预算',
              },
              {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: '实际支出',
              },
            ],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

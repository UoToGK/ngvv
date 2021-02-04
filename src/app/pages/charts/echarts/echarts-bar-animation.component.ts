import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-echarts-bar-animation',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsBarAnimationComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: DyThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const xAxisData = [];
      const data1 = [];
      const data2 = [];

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight, colors.infoLight],
        legend: {
          data: ['柱状图', '柱状图2'],
          align: 'left',
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            data: xAxisData,
            silent: false,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: '柱状图',
            type: 'bar',
            data: data1,
            animationDelay: idx => idx * 10,
          },
          {
            name: '柱状图2',
            type: 'bar',
            data: data2,
            animationDelay: idx => idx * 10 + 100,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: idx => idx * 5,
      };

      for (let i = 0; i < 100; i++) {
        xAxisData.push('类别 ' + i);
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
      }
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';
import { takeWhile } from 'rxjs/operators';

import { TrafficChartData } from '../../../@core/data/traffic-chart';

@Component({
  selector: 'ngx-traffic',
  styleUrls: ['./traffic.component.scss'],
  template: `
    <dy-card size="tiny">
      <dy-card-header>
        <span>交通消耗</span>

        <dy-select matRipple [(selected)]="type">
          <dy-option matRipple *ngFor="let t of types" [value]="t">{{ t }}</dy-option>
        </dy-select>
      </dy-card-header>

      <ngx-traffic-chart [points]="trafficChartPoints"></ngx-traffic-chart>
    </dy-card>
  `,
})
export class TrafficComponent implements OnDestroy {

  private alive = true;

  trafficChartPoints: number[];
  type = '周';
  types = ['周', '月', '年'];
  currentTheme: string;

  constructor(private themeService: DyThemeService,
              private trafficChartService: TrafficChartData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
      this.currentTheme = theme.name;
    });

    this.trafficChartService.getTrafficChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.trafficChartPoints = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

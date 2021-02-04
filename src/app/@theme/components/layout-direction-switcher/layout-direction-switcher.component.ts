import { Component, OnDestroy, Input } from '@angular/core';
import { DyLayoutDirectionService, DyLayoutDirection } from 'src/framework/theme/public_api';
import { takeWhile } from 'rxjs/operators';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

@Component({
  selector: 'ngx-layout-direction-switcher',
  template: `
    <ngx-switcher
      [firstValue]="directions.RTL"
      [secondValue]="directions.LTR"
      [firstValueLabel]="'右到左'"
      [secondValueLabel]="'左到右'"
      [value]="currentDirection"
      (valueChange)="toggleDirection($event)"
      [vertical]="vertical">
    </ngx-switcher>
  `,
})
export class LayoutDirectionSwitcherComponent implements OnDestroy {
  directions = DyLayoutDirection;
  currentDirection: DyLayoutDirection;
  alive = true;

  @Input() vertical: boolean = false;

  constructor(private directionService: DyLayoutDirectionService,
              private analyticsService: AnalyticsService) {
    this.currentDirection = this.directionService.getDirection();

    this.directionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(newDirection => this.currentDirection = newDirection);
  }

  toggleDirection(newDirection) {
    this.directionService.setDirection(newDirection);

    this.analyticsService.trackEvent('toggleDirection', newDirection);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

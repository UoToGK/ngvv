/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input, HostBinding, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { DyDateService } from '../../services/date.service';
import { DyCalendarSize, DyCalendarSizeValues } from '../../model';

@Component({
  selector: 'dy-calendar-week-numbers',
  template: `
    <div class="sign-container">
      <div class="sign">{{ weekNumberSymbol }}</div>
    </div>
    <div class="week-number" *ngFor="let weekNumber of weekNumbers">{{ weekNumber }}</div>
  `,
  styleUrls: ['./calendar-week-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarWeekNumberComponent<D> implements OnChanges {

  weekNumbers: number[];

  @Input()
  weeks: D[][];

  @Input()
  size: DyCalendarSize;
  static ngAcceptInputType_size: DyCalendarSizeValues;

  /**
   * Sets symbol used as a header for week numbers column
   * */
  @Input() weekNumberSymbol: string;

  @HostBinding('class.size-large')
  get isLarge() {
    return this.size === DyCalendarSize.LARGE;
  }

  constructor(private dateService: DyDateService<D>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weeks) {
      this.weekNumbers = this.getWeeks();
    }
  }

  getWeeks(): number[] {
    return this.weeks.map((week: D[]) => {
      // Find last defined day as week could contain null days in case
      // boundingMonth set to false
      const lastDay = [ ...week ].reverse().find((day: D) => !!day);
      // Use last day of the week to determine week number.
      // This way weeks which span between sibling years is marked first
      return this.dateService.getWeekNumber(lastDay);
    });
  }
}

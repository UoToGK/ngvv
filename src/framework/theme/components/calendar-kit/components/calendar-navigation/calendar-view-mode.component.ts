

import { TranslationWidth } from '@angular/common';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DyCalendarViewMode, DyCalendarViewModeValues } from '../../model';
import { DyCalendarYearModelService } from '../../services/calendar-year-model.service';
import { DyDateService } from '../../services/date.service';


@Component({
  selector: 'dy-calendar-view-mode',
  template: `
    <button dyButton (click)="changeMode.emit()" ghost status="basic">
      {{ getText() }}
      <dy-icon [icon]="getIcon()" pack="nebular-essentials"></dy-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DyCalendarViewModeComponent<D> {
  @Input() date: D;
  @Input() viewMode: DyCalendarViewMode = DyCalendarViewMode.DATE;
  static ngAcceptInputType_viewMode: DyCalendarViewModeValues;
  @Output() changeMode = new EventEmitter<void>(true);

  constructor(
    protected dateService: DyDateService<D>,
    protected yearModelService: DyCalendarYearModelService<D>,
  ) {}

  getText(): string {
    if (!this.date) {
      return '';
    }

    switch (this.viewMode) {
      case DyCalendarViewMode.DATE: {
        const month = this.dateService.getMonthName(this.date, TranslationWidth.Wide);
        const year = this.dateService.getYear(this.date);
        return `${month} ${year}`;
      }
      case DyCalendarViewMode.MONTH:
        return `${this.dateService.getYear(this.date)}`;
      case DyCalendarViewMode.YEAR:
        return `${this.getFirstYear()} - ${this.getLastYear()}`;
    }
  }

  getIcon(): string {
    if (this.viewMode === DyCalendarViewMode.DATE) {
      return 'chevron-down-outline';
    }

    return 'chevron-up-outline';
  }

  protected getFirstYear(): string {
    const years = this.yearModelService.getViewYears(this.date);
    return this.dateService.getYear(years[0][0]).toString();
  }

  protected getLastYear(): string {
    const years = this.yearModelService.getViewYears(this.date);
    const lastRow = years[years.length - 1];
    const lastYear = lastRow[lastRow.length - 1];

    return this.dateService.getYear(lastYear).toString();
  }
}

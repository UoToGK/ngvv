/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable, Type } from '@angular/core';

import { DyCalendarRange } from '../calendar/calendar-range.component';
import { DyDatepickerComponent, DyRangepickerComponent } from './datepicker.component';
import { DyDatepickerAdapter } from './datepicker.directive';
import { DyDateService } from '../calendar-kit/services/date.service';
import { DyDateTimePickerComponent } from './date-timepicker.component';

@Injectable()
export class DyDateAdapterService<D> extends DyDatepickerAdapter<D> {
  picker: Type<DyDatepickerComponent<D>> = DyDatepickerComponent;

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  parse(date: string, format): D {
    return this.dateService.parse(date, format);
  }

  format(date: D, format: string): string {
    return this.dateService.format(date, format);
  }

  isValid(date: string, format: string): boolean {
    return this.dateService.isValidDateString(date, format);
  }
}

@Injectable()
export class DyRangeAdapterService<D> extends DyDatepickerAdapter<DyCalendarRange<D>> {
  picker: Type<DyRangepickerComponent<D>> = DyRangepickerComponent;

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  parse(range: string, format): DyCalendarRange<D> {
    const [start, end] = range.split('-').map(subDate => subDate.trim());
    return {
      start: this.dateService.parse(start, format),
      end: this.dateService.parse(end, format),
    };
  }

  format(range: DyCalendarRange<D>, format: string): string {
    if (!range) {
      return '';
    }

    const start = this.dateService.format(range.start, format);
    const isStartValid = this.dateService.isValidDateString(start, format);

    if (!isStartValid) {
      return '';
    }

    const end = this.dateService.format(range.end, format);
    const isEndValid = this.dateService.isValidDateString(end, format);

    if (isEndValid) {
      return `${start} - ${end}`;
    } else {
      return start;
    }
  }

  isValid(range: string, format: string): boolean {
    const [start, end] = range.split('-').map(subDate => subDate.trim());
    return this.dateService.isValidDateString(start, format) && this.dateService.isValidDateString(end, format);
  }
}

@Injectable()
export class DyDateTimeAdapterService<D> extends DyDatepickerAdapter<D> {
  picker: Type<DyDateTimePickerComponent<D>> = DyDateTimePickerComponent;

  constructor(protected dateService: DyDateService<D>) {
    super();
  }

  parse(date: string, format: string): D {
    return this.dateService.parse(date, format);
  }

  format(date: any, format: string): string {
    return this.dateService.format(date, format);
  }

  isValid(date: string, format: string): boolean {
    return this.dateService.isValidDateString(date, format);
  }
}

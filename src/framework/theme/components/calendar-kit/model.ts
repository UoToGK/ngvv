

import { EventEmitter } from '@angular/core';

export interface DyCalendarDay {
  name: string;
  isHoliday: boolean;
}

export type DyCalendarViewModeValues = 'year' | 'month' | 'date';
export enum DyCalendarViewMode {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'date',
}

export type DyCalendarSizeValues = 'medium' | 'large';
export enum DyCalendarSize {
  MEDIUM = 'medium',
  LARGE = 'large',
}

export interface DyCalendarCell<D, T> {
  date: D;
  select: EventEmitter<D>;
  selectedValue?: T;
  visibleDate?: D;
  min?: D;
  max?: D;
  filter?: (D) => boolean;
  size?: DyCalendarSize;
}

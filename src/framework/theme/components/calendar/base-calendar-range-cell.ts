

import { DyCalendarRange } from './calendar-range.component';

export abstract class DyBaseCalendarRangeCell<D> {
  abstract selectedValue: DyCalendarRange<D>;

  get hasRange(): boolean {
    return !!(this.selectedValue && this.selectedValue.start && this.selectedValue.end);
  }
}

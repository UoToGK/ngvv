

import { InjectionToken } from '@angular/core';

export const DY_TIME_PICKER_CONFIG = new InjectionToken('DY_TIME_PICKER_CONFIG');

export interface DyTimePickerConfig {
  twelveHoursFormat?: boolean,
  format?: string,
}

export interface DySelectedTimeModel {
  value: string;
}

export interface DySelectedTimePayload<D> {
  time: D,
  save?: boolean,
}

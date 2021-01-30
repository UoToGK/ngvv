

import { Injectable } from '@angular/core';
import { DyComponentOrCustomStatus } from '../component-status';
import { DyComponentSize } from '../component-size';
import { Observable } from 'rxjs';

/*
 * Class used as injection token to provide form element.
 **/
@Injectable()
export abstract class DyFormFieldControl {
  status$: Observable<DyComponentOrCustomStatus>;
  size$: Observable<DyComponentSize>;
  focused$: Observable<boolean>;
  disabled$: Observable<boolean>;
  fullWidth$: Observable<boolean>;
}

/*
 * Optional config to be provided on DyFormFieldControl to alter default settings.
 **/
@Injectable()
export class DyFormFieldControlConfig {
  supportsPrefix = true;
  supportsSuffix = true;
}

export interface DyFormControlState {
  status: DyComponentOrCustomStatus;
  size: DyComponentSize;
  fullWidth: boolean;
  focused: boolean;
  disabled: boolean;
}

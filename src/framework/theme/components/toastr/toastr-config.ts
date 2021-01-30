

import { InjectionToken } from '@angular/core';

import { DyGlobalLogicalPosition, DyGlobalPosition } from '../cdk/overlay/position-helper';
import { DyComponentOrCustomStatus, DyComponentStatus } from '../component-status';
import { DyIconConfig } from '../icon/icon.component';

type IconToClassMap = {
  [status in DyComponentStatus]: string;
}

export const DY_TOASTR_CONFIG = new InjectionToken<DyToastrConfig>('Default toastr options');

export type DyDuplicateToastBehaviour = 'previous' | 'all';

/**
 * The `DyToastrConfig` class describes configuration of the `DyToastrService.show` and global toastr configuration.
 * */
export class DyToastrConfig {
  /**
   * Determines where on the screen toast have to be rendered.
   * */
  position: DyGlobalPosition = DyGlobalLogicalPosition.TOP_END;
  /**
   * Status chooses color scheme for the toast.
   * */
  status: DyComponentOrCustomStatus = 'basic';
  /**
   * Duration is timeout between toast appears and disappears.
   * */
  duration: number = 3000;
  /**
   * Destroy by click means you can hide the toast by clicking it.
   * */
  destroyByClick: boolean = true;
  /**
   * If preventDuplicates is true then the toast with the same title, message and status will not be rendered.
   * Find duplicates behaviour determined by `preventDuplicates`.
   * The default `previous` duplicate behaviour is used.
   * */
  preventDuplicates: boolean = false;
  /**
   * Determines the how to treat duplicates.
   * */
  duplicatesBehaviour: DyDuplicateToastBehaviour = 'previous';
  /*
  * The number of visible toasts. If the limit exceeded the oldest toast will be removed.
  * */
  limit?: number = null;
  /**
   * Class to be applied to the toast.
   */
  toastClass: string = '';
  /**
   * Determines render icon or not.
   * */
  hasIcon: boolean = true;
  /**
   * Icon name or icon config object that can be provided to render custom icon.
   * */
  icon: string | DyIconConfig = 'email';
  /**
   * Toast status icon-class mapping.
   * */
  protected icons: IconToClassMap = {
    danger: 'flash-outline',
    success: 'checkmark-outline',
    info: 'question-mark-outline',
    warning: 'alert-triangle-outline',
    primary: 'email-outline',
    control: 'email-outline',
    basic: 'email-outline',
  };

  constructor(config: Partial<DyToastrConfig>) {
    this.patchIcon(config);
    Object.assign(this, config);
  }

  protected patchIcon(config: Partial<DyToastrConfig>) {
    if (!('icon' in config)) {
      config.icon = {
        icon: this.icons[config.status] || this.icons.basic,
        pack: 'nebular-essentials',
      };
    }
  }
}



import { InjectionToken, ViewContainerRef } from '@angular/core';


export const DY_DIALOG_CONFIG = new InjectionToken<DyDialogConfig>('Default dialog options');

/**
 * Describes all available options that may be passed to the DyDialogService.
 * */
export class DyDialogConfig<D = any> {
  /**
   * If true than overlay will render backdrop under a dialog.
   * */
  hasBackdrop: boolean = true;

  /**
   * Class that'll be assigned to the backdrop element.
   * */
  backdropClass: string = 'overlay-backdrop';

  /**
   * Class that'll be assigned to the dialog overlay.
   * */
  dialogClass: string = '';

  /**
   * If true then mouse clicks by backdrop will close a dialog.
   * */
  closeOnBackdropClick: boolean = true;

  /**
   * If true then escape press will close a dialog.
   * */
  closeOnEsc: boolean = true;

  /**
   * Disables scroll on content under dialog if true and does nothing otherwise.
   * */
  hasScroll: boolean = false;

  /**
   * Focuses dialog automatically after open if true.
   * */
  autoFocus: boolean = true;

  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef: ViewContainerRef;

  context: D;

  constructor(config: Partial<DyDialogConfig>) {
    Object.assign(this, config);
  }
}

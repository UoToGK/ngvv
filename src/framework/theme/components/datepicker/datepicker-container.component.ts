/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, ComponentRef, ViewChild } from '@angular/core';

import { DyComponentPortal } from '../cdk/overlay/mapping';
import { DyOverlayContainerComponent, DyPositionedContainerComponent } from '../cdk/overlay/overlay-container';


@Component({
  selector: 'dy-datepicker-container',
  template: `
    <dy-overlay-container></dy-overlay-container>
  `,
})
export class DyDatepickerContainerComponent extends DyPositionedContainerComponent {

  // TODO static must be false as of Angular 9.0.0, issues/1514
  @ViewChild(DyOverlayContainerComponent, { static: true }) overlayContainer: DyOverlayContainerComponent;

  attach<T>(portal: DyComponentPortal<T>): ComponentRef<T> {
    return this.overlayContainer.attachComponentPortal(portal);
  }
}

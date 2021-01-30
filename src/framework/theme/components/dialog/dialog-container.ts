

import { Component, ComponentRef, ElementRef, EmbeddedViewRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DyComponentPortal, DyPortalOutletDirective, DyTemplatePortal } from '../cdk/overlay/mapping';
import { DyFocusTrap, DyFocusTrapFactoryService } from '../cdk/a11y/focus-trap';
import { DyDialogConfig } from './dialog-config';


/**
 * Container component for each dialog.
 * All the dialogs will be attached to it.
 * // TODO add animations
 * */
@Component({
  selector: 'dy-dialog-container',
  template: '<ng-template dyPortalOutlet></ng-template>',
})
export class DyDialogContainerComponent implements OnInit, OnDestroy {

  // TODO static must be false as of Angular 9.0.0, issues/1514
  @ViewChild(DyPortalOutletDirective, { static: true }) portalOutlet: DyPortalOutletDirective;

  protected focusTrap: DyFocusTrap;

  constructor(protected config: DyDialogConfig,
              protected elementRef: ElementRef,
              protected focusTrapFactory: DyFocusTrapFactoryService) {
  }

  ngOnInit() {
    if (this.config.autoFocus) {
      this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
      this.focusTrap.blurPreviouslyFocusedElement();
      this.focusTrap.focusInitialElement();
    }
  }

  ngOnDestroy() {
    if (this.config.autoFocus && this.focusTrap) {
      this.focusTrap.restoreFocus();
    }
  }

  attachComponentPortal<T>(portal: DyComponentPortal<T>): ComponentRef<T> {
    return this.portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: DyTemplatePortal<C>): EmbeddedViewRef<C> {
    return this.portalOutlet.attachTemplatePortal(portal);
  }
}

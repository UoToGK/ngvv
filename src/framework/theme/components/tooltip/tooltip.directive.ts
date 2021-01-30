/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DyComponentOrCustomStatus } from '../component-status';
import { DyAdjustment, DyPosition, DyPositionValues, DyAdjustmentValues } from '../cdk/overlay/overlay-position';
import { DyTrigger } from '../cdk/overlay/overlay-trigger';
import { DyDynamicOverlay } from '../cdk/overlay/dynamic/dynamic-overlay';
import { DyDynamicOverlayHandler } from '../cdk/overlay/dynamic/dynamic-overlay-handler';
import { DyOverlayConfig } from '../cdk/overlay/mapping';
import { DyTooltipComponent } from './tooltip.component';
import { DyIconConfig } from '../icon/icon.component';

/**
 *
 * Tooltip directive for small text/icon hints.
 *
 * ### Installation
 *
 * Import `DyTooltipModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyTooltipModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * @stacked-example(Showcase, tooltip/tooltip-showcase.component)
 *
 * Tooltip can accept a hint text and/or an icon:
 * @stacked-example(With Icon, tooltip/tooltip-with-icon.component)
 *
 * Same way as Popover, tooltip can accept placement position with `dyTooltipPlacement` property:
 * @stacked-example(Placements, tooltip/tooltip-placements.component)
 *
 * It is also possible to specify tooltip color using `dyTooltipStatus` property:
 * @stacked-example(Colored Tooltips, tooltip/tooltip-colors.component)
 *
 * Tooltip has a number of triggers which provides an ability to show and hide the component in different ways:
 *
 * - Click mode shows the component when a user clicks on the host element and hides when the user clicks
 * somewhere on the document outside the component.
 * - Hint provides capability to show the component when the user hovers over the host element
 * and hide when the user hovers out of the host.
 * - Hover works like hint mode with one exception - when the user moves mouse from host element to
 * the container element the component remains open, so that it is possible to interact with it content.
 * - Focus mode is applied when user focuses the element.
 * - Noop mode - the component won't react to the user interaction.
 */
@Directive({
  selector: '[dyTooltip]',
  exportAs: 'dyTooltip',
  providers: [DyDynamicOverlayHandler, DyDynamicOverlay],
})
export class DyTooltipDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  protected destroy$ = new Subject<void>();
  protected tooltipComponent = DyTooltipComponent;
  protected dynamicOverlay: DyDynamicOverlay;

  context: Object = {};

  /**
   * Tooltip message
   */
  @Input('dyTooltip')
  content: string;
  /**
   * Position will be calculated relatively host element based on the position.
   * Can be top, right, bottom, left, start or end.
   */
  @Input('dyTooltipPlacement')
  position: DyPosition = DyPosition.TOP;
  static ngAcceptInputType_position: DyPositionValues;

  /**
   * Container position will change automatically based on this strategy if container can't fit view port.
   * Set this property to `noop` value if you want to disable automatic adjustment.
   * Available values: `clockwise` (default), `counterclockwise`, `vertical`, `horizontal`, `noop`.
   */
  @Input('dyTooltipAdjustment')
  get adjustment(): DyAdjustment {
    return this._adjustment;
  }
  set adjustment(value: DyAdjustment) {
    this._adjustment = value;
  }
  protected _adjustment: DyAdjustment = DyAdjustment.CLOCKWISE;
  static ngAcceptInputType_adjustment: DyAdjustmentValues;

  @Input('dyTooltipClass')
  get tooltipClass(): string {
    return this._tooltipClass;
  }
  set tooltipClass(value: string) {
    if (value !== this.tooltipClass) {
      this._tooltipClass = value;
      this.overlayConfig = { panelClass: this.tooltipClass };
    }
  }
  _tooltipClass: string = '';

  /**
   * Accepts icon name or icon config object
   * @param {string | DyIconConfig} icon name or config object
   */
  @Input('dyTooltipIcon')
  set icon(icon: string | DyIconConfig) {
    this.context = Object.assign(this.context, {icon});
  }

  /**
   *
   * @param {string} status
   */
  @Input('dyTooltipStatus')
  set status(status: DyComponentOrCustomStatus) {
    this.context = Object.assign(this.context, {status});
  }

  /**
   * Describes when the container will be shown.
   * Available options: `click`, `hover`, `hint`, `focus` and `noop`
   * */
  @Input('dyTooltipTrigger')
  trigger: DyTrigger = DyTrigger.HINT;

  /**
   * Determines tooltip overlay offset (in pixels).
   **/
  @Input('dyTooltipOffset') offset = 8;

  @Output()
  dyTooltipShowStateChange = new EventEmitter<{ isShown: boolean }>();

  protected overlayConfig: DyOverlayConfig = { panelClass: this.tooltipClass };

  get isShown(): boolean {
    return !!(this.dynamicOverlay && this.dynamicOverlay.isAttached);
  }

  constructor(protected hostRef: ElementRef,
              protected dynamicOverlayHandler: DyDynamicOverlayHandler) {
  }

  ngOnInit() {
    this.dynamicOverlayHandler
      .host(this.hostRef)
      .componentType(this.tooltipComponent)
      .offset(this.offset);
  }

  ngOnChanges() {
    this.rebuild();
  }

  ngAfterViewInit() {
    this.dynamicOverlay = this.configureDynamicOverlay()
      .build();

    this.dynamicOverlay.isShown
      .pipe(
        skip(1),
        takeUntil(this.destroy$),
      )
      .subscribe((isShown: boolean) => this.dyTooltipShowStateChange.emit({ isShown }));
  }

  rebuild() {
    this.dynamicOverlay = this.configureDynamicOverlay()
      .rebuild();
  }

  show() {
    this.dynamicOverlay.show();
  }

  hide() {
    this.dynamicOverlay.hide();
  }

  toggle() {
    this.dynamicOverlay.toggle();
  }

  ngOnDestroy() {
    this.dynamicOverlayHandler.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected configureDynamicOverlay() {
    return this.dynamicOverlayHandler
      .position(this.position)
      .trigger(this.trigger)
      .adjustment(this.adjustment)
      .content(this.content)
      .context(this.context)
      .overlayConfig(this.overlayConfig);
  }
}

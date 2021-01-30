

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
  SimpleChanges,
} from '@angular/core';

import { DyDynamicOverlay, DyDynamicOverlayController } from '../cdk/overlay/dynamic/dynamic-overlay';
import { DyDynamicOverlayHandler } from '../cdk/overlay/dynamic/dynamic-overlay-handler';
import { DyAdjustment, DyPosition, DyPositionValues, DyAdjustmentValues } from '../cdk/overlay/overlay-position';
import { DyOverlayContent } from '../cdk/overlay/overlay-service';
import { DyTrigger, DyTriggerValues } from '../cdk/overlay/overlay-trigger';
import { DyOverlayConfig } from '../cdk/overlay/mapping';
import { DyPopoverComponent } from './popover.component';
import { takeUntil, skip } from 'rxjs/operators';
import { Subject } from 'rxjs';


/**
 * Powerful popover directive, which provides the best UX for your users.
 *
 * @stacked-example(Showcase, popover/popover-showcase.component)
 *
 * Popover can accept different content such as:
 * TemplateRef
 *
 * ```html
 * <button [dyPopover]="templateRef"></button>
 * <ng-template #templateRef>
 *   <span>Hello, Popover!</span>
 * </ng-template>
 * ```
 * ### Installation
 *
 * Import `DyPopoverModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyPopoverModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Custom components
 *
 * ```html
 * <button [dyPopover]="MyPopoverComponent"></button>
 * ```
 *
 * Both custom components and templateRef popovers can receive *contentContext* property
 * that will be passed to the content props.
 *
 * Primitive types
 *
 * ```html
 * <button dyPopover="Hello, Popover!"></button>
 * ```
 *
 * Popover has different placements, such as: top, bottom, left, right, start and end
 * which can be used as following:
 *
 * @stacked-example(Placements, popover/popover-placements.component)
 *
 * By default popover will try to adjust itself to maximally fit viewport
 * and provide the best user experience. It will try to change position of the popover container.
 * If you want to disable this behaviour set it `noop`.
 *
 * ```html
 * <button dyPopover="Hello, Popover!" dyPopoverAdjustment="noop"></button>
 * ```
 *
 * Popover has a number of triggers which provides an ability to show and hide the component in different ways:
 *
 * - Click mode shows the component when a user clicks on the host element and hides when the user clicks
 * somewhere on the document outside the component.
 * - Hint provides capability to show the component when the user hovers over the host element
 * and hide when the user hovers out of the host.
 * - Hover works like hint mode with one exception - when the user moves mouse from host element to
 * the container element the component remains open, so that it is possible to interact with it content.
 * - Focus mode is applied when user focuses the element.
 * - Noop mode - the component won't react to the user interaction.
 *
 * @stacked-example(Available Triggers, popover/popover-modes.component.html)
 *
 * Noop mode is especially useful when you need to control Popover programmatically, for example show/hide
 * as a result of some third-party action, like HTTP request or validation check:
 *
 * @stacked-example(Manual Control, popover/popover-noop.component)
 *
 * Below are examples for manual popover settings control, both via template binding and code.
 * @stacked-example(Popover Settings, popover/popover-dynamic.component)
 *
 * Please note, while manipulating Popover setting via code, you need to call `rebuild()` method to apply the settings
 * changed.
 * @stacked-example(Popover Settings Code, popover/popover-dynamic-code.component)
 *
 * @additional-example(Template Ref, popover/popover-template-ref.component)
 * @additional-example(Custom Component, popover/popover-custom-component.component)
 * */
@Directive({
  selector: '[dyPopover]',
  exportAs: 'dyPopover',
  providers: [DyDynamicOverlayHandler, DyDynamicOverlay],
})
export class DyPopoverDirective implements DyDynamicOverlayController, OnChanges, AfterViewInit, OnDestroy, OnInit {

  protected popoverComponent = DyPopoverComponent;
  protected dynamicOverlay: DyDynamicOverlay;
  protected destroy$ = new Subject<void>();

  /**
   * Popover content which will be rendered in DyArrowedOverlayContainerComponent.
   * Available content: template ref, component and any primitive.
   * */
  @Input('dyPopover')
  content: DyOverlayContent;

  /**
   * Container content context. Will be applied to the rendered component.
   * */
  @Input('dyPopoverContext')
  context: Object = {};

  /**
   * Position will be calculated relatively host element based on the position.
   * Can be top, right, bottom, left, start or end.
   * */
  @Input('dyPopoverPlacement')
  position: DyPosition = DyPosition.TOP;
  static ngAcceptInputType_position: DyPositionValues;

  /**
   * Container position will be changes automatically based on this strategy if container can't fit view port.
   * Set this property to `noop` value if you want to disable automatically adjustment.
   * Available values: `clockwise` (default), `counterclockwise`, `vertical`, `horizontal`, `noop`.
   * */
  @Input('dyPopoverAdjustment')
  get adjustment(): DyAdjustment {
    return this._adjustment;
  }
  set adjustment(value: DyAdjustment) {
    this._adjustment = value;
  }
  protected _adjustment: DyAdjustment = DyAdjustment.CLOCKWISE;
  static ngAcceptInputType_adjustment: DyAdjustmentValues;

  /**
   * Describes when the container will be shown.
   * Available options: `click`, `hover`, `hint`, `focus` and `noop`
   * */
  @Input('dyPopoverTrigger')
  trigger: DyTrigger = DyTrigger.CLICK;
  static ngAcceptInputType_trigger: DyTriggerValues;

  /**
   * Sets popover offset
   * */
  @Input('dyPopoverOffset')
  offset = 15;

  @Input('dyPopoverClass')
  get popoverClass(): string {
    return this._popoverClass;
  }
  set popoverClass(value: string) {
    if (value !== this.popoverClass) {
      this._popoverClass = value;
      this.overlayConfig = { panelClass: this.popoverClass };
    }
  }
  _popoverClass: string = '';

  @Output()
  dyPopoverShowStateChange = new EventEmitter<{ isShown: boolean }>();

  protected overlayConfig: DyOverlayConfig = { panelClass: this.popoverClass }

  get isShown(): boolean {
    return !!(this.dynamicOverlay && this.dynamicOverlay.isAttached);
  }

  constructor(protected hostRef: ElementRef,
              protected dynamicOverlayHandler: DyDynamicOverlayHandler) {
  }

  ngOnInit() {
    this.dynamicOverlayHandler
      .host(this.hostRef)
      .componentType(this.popoverComponent);
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
      .subscribe((isShown: boolean) => this.dyPopoverShowStateChange.emit({ isShown }));
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
      .offset(this.offset)
      .adjustment(this.adjustment)
      .content(this.content)
      .context(this.context)
      .overlayConfig(this.overlayConfig);
  }
}

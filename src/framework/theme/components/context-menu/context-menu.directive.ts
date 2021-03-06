

import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DyDynamicOverlay, DyDynamicOverlayController } from '../cdk/overlay/dynamic/dynamic-overlay';
import { DyDynamicOverlayHandler } from '../cdk/overlay/dynamic/dynamic-overlay-handler';
import { DyOverlayConfig, DyOverlayRef } from '../cdk/overlay/mapping';
import { DyAdjustableConnectedPositionStrategy, DyAdjustment, DyPosition } from '../cdk/overlay/overlay-position';
import { DyTrigger, DyTriggerValues } from '../cdk/overlay/overlay-trigger';
import { DyContextMenuComponent } from './context-menu.component';
import { DyMenuItem, DyMenuService } from '../menu/menu.service';

export interface DyContextMenuContext {
  items: DyMenuItem[];
  tag: string;
  position: DyPosition;
}

/**
 * Full featured context menu directive.
 *
 * @stacked-example(Showcase, context-menu/context-menu-showcase.component)
 *
 * Just pass menu items array:
 *
 * ```html
 * <button [dyContextMenu]="items"></button>
 * ...
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 * ### Installation
 *
 * Import `DyContextMenuModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyContextMenuModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * Also make sure `DyMenuModule` is imported to your `app.module`.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyMenuModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * If you want to handle context menu clicks you have to pass `dyContextMenuTag`
 * param and register to events using DyMenuService.
 * `DyContextMenu` renders plain `DyMenu` inside, so
 * you have to work with it just like with `DyMenu` component:
 *
 * @stacked-example(Menu item click, context-menu/context-menu-click.component)
 *
 * Context menu has different placements, such as: top, bottom, left and right
 * which can be used as following:
 *
 * ```html
 * <button [dyContextMenu]="items" dyContextMenuPlacement="right"></button>
 * ```
 *
 * ```ts
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 *
 * By default context menu will try to adjust itself to maximally fit viewport
 * and provide the best user experience. It will try to change position of the context menu.
 * If you wanna disable this behaviour just set it falsy value.
 *
 * ```html
 * <button [dyContextMenu]="items" dyContextMenuAdjustment="counterclockwise"></button>
 * ```
 *
 * ```ts
 * items = [{ title: 'Profile' }, { title: 'Log out' }];
 * ```
 * Context menu has a number of triggers which provides an ability to show and hide the component in different ways:
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
 * @stacked-example(Available Triggers, context-menu/context-menu-modes.component.html)
 *
 * Noop mode is especially useful when you need to control Popover programmatically, for example show/hide
 * as a result of some third-party action, like HTTP request or validation check:
 *
 * @stacked-example(Manual Control, context-menu/context-menu-noop.component)
 *
 * @stacked-example(Manual Control, context-menu/context-menu-right-click.component)
 * */
@Directive({
  selector: '[dyContextMenu]',
  providers: [DyDynamicOverlayHandler, DyDynamicOverlay],
})
export class DyContextMenuDirective implements DyDynamicOverlayController, OnChanges, AfterViewInit, OnDestroy, OnInit {

  @HostBinding('class.context-menu-host')
  contextMenuHost = true;

  /**
   * Position will be calculated relatively host element based on the position.
   * Can be top, right, bottom and left.
   * */
  @Input('dyContextMenuPlacement')
  get position(): DyPosition {
    return this._position;
  }
  set position(value: DyPosition) {
    if (value !== this.position) {
      this._position = value;
      this.updateOverlayContext();
    }
  }
  _position: DyPosition = DyPosition.BOTTOM;

  /**
   * Container position will be changes automatically based on this strategy if container can't fit view port.
   * Set this property to any falsy value if you want to disable automatically adjustment.
   * Available values: clockwise, counterclockwise.
   * */
  @Input('dyContextMenuAdjustment')
  adjustment: DyAdjustment = DyAdjustment.CLOCKWISE;

  /**
   * Set DyMenu tag, which helps identify menu when working with DyMenuService.
   * */
  @Input('dyContextMenuTag')
  get tag(): string {
    return this._tag;
  }
  set tag(value: string) {
    if (value !== this.tag) {
      this._tag = value;
      this.updateOverlayContext();
    }
  }
  _tag: string;

  /**
   * Basic menu items, will be passed to the internal DyMenuComponent.
   * */
  @Input('dyContextMenu')
  get items(): DyMenuItem[] {
    return this._items;
  }
  set items(items: DyMenuItem[]) {
    this.validateItems(items);
    this._items = items;
    this.updateOverlayContext();
  };

  /**
   * Describes when the container will be shown.
   * Available options: `click`, `hover`, `hint`, `focus` and `noop`
   * */
  @Input('dyContextMenuTrigger')
  trigger: DyTrigger = DyTrigger.CLICK;
  static ngAcceptInputType_trigger: DyTriggerValues;

  @Input('dyContextMenuClass')
  get contextMenuClass(): string {
    return this._contextMenuClass;
  }
  set contextMenuClass(value: string) {
    if (value !== this.contextMenuClass) {
      this._contextMenuClass = value;
      this.overlayConfig = { panelClass: this.contextMenuClass };
    }
  }
  _contextMenuClass: string = '';

  protected ref: DyOverlayRef;
  protected container: ComponentRef<any>;
  protected positionStrategy: DyAdjustableConnectedPositionStrategy;
  protected overlayConfig: DyOverlayConfig = { panelClass: this.contextMenuClass } ;
  protected overlayContext: DyContextMenuContext = { items: this.items, tag: this.tag, position: this.position };
  protected destroy$ = new Subject<void>();
  private _items: DyMenuItem[] = [];

  private dynamicOverlay: DyDynamicOverlay;

  constructor(private hostRef: ElementRef,
              private menuService: DyMenuService,
              private dynamicOverlayHandler: DyDynamicOverlayHandler) {
  }

  ngOnInit() {
    this.dynamicOverlayHandler
      .host(this.hostRef)
      .componentType(DyContextMenuComponent);
  }

  ngOnChanges() {
    this.rebuild();
  }

  ngAfterViewInit() {
    this.dynamicOverlay = this.configureDynamicOverlay()
      .build();
    this.subscribeOnItemClick();
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
  }

  protected configureDynamicOverlay() {
    return this.dynamicOverlayHandler
      .position(this.position)
      .trigger(this.trigger)
      .adjustment(this.adjustment)
      .context(this.overlayContext)
      .overlayConfig(this.overlayConfig);
  }

  /*
   * DyMenuComponent will crash if don't pass menu items to it.
   * So, we just validating them and throw custom obvious error.
   * */
  private validateItems(items: DyMenuItem[]) {
    if (!items || !items.length) {
      throw Error(`List of menu items expected, but given: ${items}`)
    }
  }

  private subscribeOnItemClick() {
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === this.tag),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.hide());
  }

  protected updateOverlayContext() {
    this.overlayContext = { items: this.items, position: this.position, tag: this.tag };
  }
}

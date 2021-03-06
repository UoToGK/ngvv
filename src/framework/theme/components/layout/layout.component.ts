

import {
  AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy,
  Renderer2, ViewChild, ViewContainerRef, Inject, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { convertToBoolProperty, DyBooleanInput } from '../helpers';
import { DyThemeService } from '../../services/theme.service';
import { DySpinnerService } from '../../services/spinner.service';
import { DyLayoutDirectionService } from '../../services/direction.service';
import { DyRestoreScrollTopHelper } from './restore-scroll-top.service';
import { DyScrollPosition, DyLayoutScrollService } from '../../services/scroll.service';
import { DyLayoutDimensions, DyLayoutRulerService } from '../../services/ruler.service';
import { DY_WINDOW, DY_DOCUMENT } from '../../theme.options';
import { DyOverlayContainerAdapter } from '../cdk/adapter/overlay-container-adapter';

/**
 * Layout container component.
 * When using with Nebular Theme System it is required that all child components should be placed inside.
 *
 * Basic example of two column layout with header:
 *
 * @stacked-example(Showcase, layout/layout-showcase.component)
 *
 * Can contain the following components inside:
 *
 * ```html
 * <dy-layout>
 *  <dy-layout-header></dy-layout-header>
 *  <dy-layout-footer></dy-layout-footer>
 *  <dy-layout-column></dy-layout-column>
 *  <dy-sidebar></dy-sidebar>
 * </dy-layout>
 * ```
 * ### Installation
 *
 * Import `DyLayoutModule` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyLayoutModule,
 *   ],
 * })
 * export class AppModule { }
 * ```
 * ### Usage
 * By default the layout fills up the whole view-port.
 * The window scrollbars are disabled on the body and moved inside of the dy-layout, so that the scrollbars
 * won't mess with the fixed dy-header.
 *
 * The child components are projected into a flexible layout structure allowing to adjust the layout behavior
 * based on the settings provided.
 *
 * The layout content (columns) becomes centered when the window width is more than
 * the value specified in the theme variable `layout-content-width`.
 *
 * The layout also contains the area on the very top (the first child of the dy-layout), which could be used
 * to dynamically append some components like modals or spinners/loaders
 * so that they are located on top of the elements hierarchy.
 * More details are under the `ThemeService` section.
 *
 * The layout component is also responsible for changing application themes.
 * It listens to the `themeChange` event and change a theme CSS class appended to body.
 * Based on the class appended, specific CSS-theme is applied to the application.
 * More details of the Theme System could be found here [Enabling Theme System](#/docs/concepts/theme-system)
 *
 * A simple layout with footer:
 *
 * @stacked-example(Layout With Footer, layout/layout-w-footer.component)
 *
 * It is possible to ask the layout to center the columns (notice: we added a `center` attribute
 * to the layout:
 *
 * ```html
 * <dy-layout center>
 *   <dy-layout-header>Awesome Company</dy-layout-header>
 *
 *   <dy-layout-column>
 *     Hello World!
 *   </dy-layout-column>
 *
 *   <dy-layout-footer>Contact us</dy-layout-footer>
 * </dy-layout>
 * ```
 *
 * @styles
 *
 * layout-background-color:
 * layout-text-color:
 * layout-text-font-family:
 * layout-text-font-size:
 * layout-text-font-weight:
 * layout-text-line-height:
 * layout-min-height:
 * layout-content-width:
 * layout-window-mode-min-width:
 * layout-window-mode-max-width:
 * layout-window-mode-background-color:
 * layout-window-mode-padding-top:
 * layout-window-shadow:
 * layout-padding:
 * layout-medium-padding:
 * layout-small-padding:
 * layout-scrollbar-background-color:
 * layout-scrollbar-color:
 * layout-scrollbar-width:
 */
@Component({
  selector: 'dy-layout',
  styleUrls: ['./layout.component.scss'],
  template: `
    <div class="scrollable-container" #scrollableContainer (scroll)="onScroll($event)">
      <div class="layout" #layoutContainer>
        <ng-content select="dy-layout-header:not([subheader])"></ng-content>
        <div class="layout-container">
          <ng-content select="dy-sidebar"></ng-content>
          <div class="content" [class.center]="centerValue">
            <ng-content select="dy-layout-header[subheader]"></ng-content>
            <div class="columns">
              <ng-content select="dy-layout-column"></ng-content>
            </div>
            <ng-content select="dy-layout-footer"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DyLayoutComponent implements AfterViewInit, OnDestroy {

  protected scrollBlockClass = 'dy-global-scrollblock';
  protected isScrollBlocked = false;
  protected scrollableContainerOverflowOldValue: string;
  protected layoutPaddingOldValue: { left: string; right: string };

  centerValue: boolean = false;
  restoreScrollTopValue: boolean = true;

  @HostBinding('class.window-mode') windowModeValue: boolean = false;
  @HostBinding('class.with-scroll') withScrollValue: boolean = false;
  @HostBinding('class.with-subheader') withSubheader: boolean = false;

  /**
   * Defines whether the layout columns will be centered after some width
   * @param {boolean} val
   */
  @Input()
  set center(val: boolean) {
    this.centerValue = convertToBoolProperty(val);
  }
  static ngAcceptInputType_center: DyBooleanInput;

  /**
   * Defines whether the layout enters a 'window' mode, when the layout content (including sidebars and fixed header)
   * becomes centered by width with a margin from the top of the screen, like a floating window.
   * Automatically enables `withScroll` mode, as in the window mode scroll must be inside the layout and cannot be on
   * window. (TODO: check this)
   * @param {boolean} val
   */
  @Input()
  set windowMode(val: boolean) {
    this.windowModeValue = convertToBoolProperty(val);
    this.withScroll = this.windowModeValue;
  }
  static ngAcceptInputType_windowMode: DyBooleanInput;

  /**
   * Defines whether to move the scrollbars to layout or leave it at the body level.
   * Automatically set to true when `windowMode` is enabled.
   * @param {boolean} val
   */
  @Input()
  set withScroll(val: boolean) {
    this.withScrollValue = convertToBoolProperty(val);

    // TODO: is this the best way of doing it? as we don't have access to body from theme styles
    // TODO: add e2e test
    const body = this.document.getElementsByTagName('body')[0];
    if (this.withScrollValue) {
      this.renderer.setStyle(body, 'overflow', 'hidden');
    } else {
      this.renderer.setStyle(body, 'overflow', 'initial');
    }
  }
  static ngAcceptInputType_withScroll: DyBooleanInput;

  /**
   * Restores scroll to the top of the page after navigation
   * @param {boolean} val
   */
  @Input()
  set restoreScrollTop(val: boolean) {
    this.restoreScrollTopValue = convertToBoolProperty(val);
  }
  static ngAcceptInputType_restoreScrollTop: DyBooleanInput;

  // TODO remove as of 5.0.0
  @ViewChild('layoutTopDynamicArea', { read: ViewContainerRef }) veryTopRef: ViewContainerRef;

  @ViewChild('scrollableContainer', { read: ElementRef })
  scrollableContainerRef: ElementRef<HTMLElement>;

  @ViewChild('layoutContainer', { read: ElementRef })
  layoutContainerRef: ElementRef<HTMLElement>;

  protected afterViewInit$ = new BehaviorSubject(null);

  private destroy$ = new Subject<void>();

  constructor(
    protected themeService: DyThemeService,
    protected spinnerService: DySpinnerService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    @Inject(DY_WINDOW) protected window,
    @Inject(DY_DOCUMENT) protected document,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected layoutDirectionService: DyLayoutDirectionService,
    protected scrollService: DyLayoutScrollService,
    protected rulerService: DyLayoutRulerService,
    protected scrollTop: DyRestoreScrollTopHelper,
    protected overlayContainer: DyOverlayContainerAdapter,
  ) {
    this.registerAsOverlayContainer();

    this.themeService.onThemeChange()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((theme: any) => {
        const body = this.document.getElementsByTagName('body')[0];
        if (theme.previous) {
          this.renderer.removeClass(body, `dy-theme-${theme.previous}`);
        }
        this.renderer.addClass(body, `dy-theme-${theme.name}`);
      });

    this.themeService.onAppendLayoutClass()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((className: string) => {
        this.renderer.addClass(this.elementRef.nativeElement, className);
      });

    this.themeService.onRemoveLayoutClass()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((className: string) => {
        this.renderer.removeClass(this.elementRef.nativeElement, className);
      });

    this.spinnerService.registerLoader(new Promise((resolve, reject) => {
      this.afterViewInit$
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe((_) => resolve(null));
    }));
    this.spinnerService.load();

    this.rulerService.onGetDimensions()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(({ listener }) => {
        listener.next(this.getDimensions());
        listener.complete();
      });

    this.scrollService
      .onScrollableChange()
      .pipe(
        filter(() => this.withScrollValue),
      )
      .subscribe((scrollable: boolean) => {
        /**
         * In case when Nebular Layout custom scroll `withScroll` mode is enabled
         * we need to disable default CDK scroll blocker (@link DyBlockScrollStrategyAdapter) on HTML element
         * so that it won't add additional positioning.
         */
        if (scrollable) {
          this.enableScroll();
        } else {
          this.blockScroll();
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      // trigger first time so that after the change we have the initial value
      this.themeService.changeWindowWidth(this.window.innerWidth);
    }
  }

  ngAfterViewInit() {
    this.scrollService.onGetPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ listener }) => {
        listener.next(this.getScrollPosition());
        listener.complete();
      });

    this.scrollTop.shouldRestore()
      .pipe(filter(
        () => this.restoreScrollTopValue),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.scroll(0, 0));

    this.layoutDirectionService.onDirectionChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(direction => this.document.dir = direction);

    this.scrollService.onManualScroll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ x, y }: DyScrollPosition) => this.scroll(x, y));

    this.afterViewInit$.next(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unregisterAsOverlayContainer();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    this.scrollService.fireScrollChange($event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.themeService.changeWindowWidth(event.target.innerWidth);
  }

  /**
   * Returns scroll and client height/width
   *
   * Depending on the current scroll mode (`withScroll=true`) returns sizes from the body element
   * or from the `.scrollable-container`
   * @returns {DyLayoutDimensions}
   */
  getDimensions(): DyLayoutDimensions {
    let clientWidth, clientHeight, scrollWidth, scrollHeight = 0;
    if (this.withScrollValue) {
      const container = this.scrollableContainerRef.nativeElement;
      clientWidth = container.clientWidth;
      clientHeight = container.clientHeight;
      scrollWidth = container.scrollWidth;
      scrollHeight = container.scrollHeight;
    } else {
      const { documentElement, body } = this.document;
      clientWidth = documentElement.clientWidth || body.clientWidth;
      clientHeight = documentElement.clientHeight || body.clientHeight;
      scrollWidth = documentElement.scrollWidth || body.scrollWidth;
      scrollHeight = documentElement.scrollHeight || body.scrollHeight;
    }

    return {
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
    };
  }

  /**
   * Returns scroll position of current scroll container.
   *
   * If `withScroll` = true, returns scroll position of the `.scrollable-container` element,
   * otherwise - of the scrollable element of the window (which may be different depending of a browser)
   *
   * @returns {DyScrollPosition}
   */
  getScrollPosition(): DyScrollPosition {
    if (!isPlatformBrowser(this.platformId)) {
      return { x: 0, y: 0 };
    }

    if (this.withScrollValue) {
      const container = this.scrollableContainerRef.nativeElement;
      return { x: container.scrollLeft, y: container.scrollTop };
    }

    const documentRect = this.document.documentElement.getBoundingClientRect();

    const x = -documentRect.left || this.document.body.scrollLeft || this.window.scrollX ||
      this.document.documentElement.scrollLeft || 0;

    const y = -documentRect.top || this.document.body.scrollTop || this.window.scrollY ||
      this.document.documentElement.scrollTop || 0;


    return { x, y };
  }

  protected registerAsOverlayContainer() {
    if (this.overlayContainer.setContainer) {
      this.overlayContainer.setContainer(this.elementRef.nativeElement);
    }
  }

  protected unregisterAsOverlayContainer() {
    if (this.overlayContainer.clearContainer) {
      this.overlayContainer.clearContainer();
    }
  }

  private scroll(x: number = null, y: number = null) {
    const { x: currentX, y: currentY } = this.getScrollPosition();
    x = x == null ? currentX : x;
    y = y == null ? currentY : y;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.withScrollValue) {
      const scrollable = this.scrollableContainerRef.nativeElement;
      if (scrollable.scrollTo) {
        scrollable.scrollTo(x, y);
      } else {
        scrollable.scrollLeft = x;
        scrollable.scrollTop = y;
      }
    } else {
      this.window.scrollTo(x, y);
    }
  }

  // TODO: Extract into block scroll strategy
  protected blockScroll() {
    if (this.isScrollBlocked) {
      return;
    }

    this.isScrollBlocked = true;

    this.renderer.addClass(this.document.documentElement, this.scrollBlockClass);

    const scrollableContainerElement = this.scrollableContainerRef.nativeElement;
    const layoutElement = this.layoutContainerRef.nativeElement;

    const layoutWithScrollWidth = layoutElement.clientWidth;
    this.scrollableContainerOverflowOldValue = scrollableContainerElement.style.overflow;
    scrollableContainerElement.style.overflow = 'hidden';
    const layoutWithoutScrollWidth = layoutElement.clientWidth;
    const scrollWidth = layoutWithoutScrollWidth - layoutWithScrollWidth;

    if (!scrollWidth) {
      return;
    }

    this.layoutPaddingOldValue = {
      left: layoutElement.style.paddingLeft,
      right: layoutElement.style.paddingRight,
    };

    if (this.layoutDirectionService.isLtr()) {
      layoutElement.style.paddingRight = `${scrollWidth}px`;
    } else {
      layoutElement.style.paddingLeft = `${scrollWidth}px`;
    }
  }

  private enableScroll() {
    if (this.isScrollBlocked) {
      this.isScrollBlocked = false;

      this.renderer.removeClass(this.document.documentElement, this.scrollBlockClass);
      this.scrollableContainerRef.nativeElement.style.overflow = this.scrollableContainerOverflowOldValue;

      if (this.layoutPaddingOldValue) {
        const layoutElement = this.layoutContainerRef.nativeElement;
        layoutElement.style.paddingLeft = this.layoutPaddingOldValue.left;
        layoutElement.style.paddingRight = this.layoutPaddingOldValue.right;
        this.layoutPaddingOldValue = null;
      }
    }
  }
}

/**
 * A container component which determines a content position inside of the layout.
 * The layout could contain unlimited columns (not including the sidebars).
 *
 * By default the columns are ordered from the left to the right,
 * but it's also possible to overwrite this behavior by setting a `left` attribute to the column,
 * moving it to the very first position:
 *
 * @stacked-example(Column Left, layout/layout-column-left.component)
 */
@Component({
  selector: 'dy-layout-column',
  template: `
    <ng-content></ng-content>
  `,
})
export class DyLayoutColumnComponent {

  @HostBinding('class.left') leftValue: boolean;
  @HostBinding('class.start') startValue: boolean;

  /**
   * Move the column to the very left position in the layout.
   * @param {boolean} val
   */
  @Input()
  set left(val: boolean) {
    this.leftValue = convertToBoolProperty(val);
    this.startValue = false;
  }
  static ngAcceptInputType_left: DyBooleanInput;

  /**
   * Make column first in the layout.
   * @param {boolean} val
   */
  @Input()
  set start(val: boolean) {
    this.startValue = convertToBoolProperty(val);
    this.leftValue = false;
  }
  static ngAcceptInputType_start: DyBooleanInput;
}

/**
 * Page header component.
 * Located on top of the page above the layout columns and sidebars.
 * Could be made `fixed` by setting the corresponding property. In the fixed mode the header becomes
 * sticky to the top of the dy-layout (to of the page). Here's an example:
 *
 * @stacked-example(Fixed Header, layout/layout-fixed-header.component)
 *
 * In a pair with sidebar it is possible to setup a configuration when header is placed on a side of the sidebar
 * and not on top of it. To achieve this simply put a `subheader` property to the header like this:
 * ```html
 * <dy-layout-header subheader></dy-layout-header>
 * ```
 * @stacked-example(Subheader, layout/layout-sidebar-subheader.component)
 * Note that in such configuration sidebar shadow is removed and header cannot be make `fixed`.
 *
 * Same way you can put both `fixed` and `clipped` headers adding creating a sub-header for your app:
 *
 * @stacked-example(Subheader, layout/layout-subheader.component)
 *
 * @styles
 *
 * header-background-color:
 * header-text-color:
 * header-text-font-family:
 * header-text-font-size:
 * header-text-font-weight:
 * header-text-line-height:
 * header-height:
 * header-padding:
 * header-shadow:
 */
@Component({
  selector: 'dy-layout-header',
  template: `
    <nav [class.fixed]="fixedValue">
      <ng-content></ng-content>
    </nav>
  `,
})
export class DyLayoutHeaderComponent {

  @HostBinding('class.fixed') fixedValue: boolean;
  @HostBinding('class.subheader') subheaderValue: boolean;

  constructor(private layout: DyLayoutComponent) {}

  /**
   * Makes the header sticky to the top of the dy-layout.
   * @param {boolean} val
   */
  @Input()
  set fixed(val: boolean) {
    this.fixedValue = convertToBoolProperty(val);
  }
  static ngAcceptInputType_fixed: DyBooleanInput;

  /**
   * Places header on a side of the sidebar, and not above.
   * Disables fixed mode for this header and remove a shadow from the sidebar.
   * @param {boolean} val
   */
  @Input()
  set subheader(val: boolean) {
    this.subheaderValue = convertToBoolProperty(val);
    this.fixedValue = false;
    this.layout.withSubheader = this.subheaderValue;
  }
  static ngAcceptInputType_subheader: DyBooleanInput;
}

/**
 * Page footer.
 * Located under the dy-layout content (specifically, under the columns).
 * Could be made `fixed`, becoming sticky to the bottom of the view port (window).
 *
 * @styles
 *
 * footer-background-color:
 * footer-text-color:
 * footer-text-font-family:
 * footer-text-font-size:
 * footer-text-font-weight:
 * footer-text-line-height:
 * footer-text-highlight-color:
 * footer-height:
 * footer-padding:
 * footer-divider-color:
 * footer-divider-style:
 * footer-divider-width:
 * footer-shadow:
 */
@Component({
  selector: 'dy-layout-footer',
  template: `
    <nav [class.fixed]="fixedValue">
      <ng-content></ng-content>
    </nav>
  `,
})
export class DyLayoutFooterComponent {

  @HostBinding('class.fixed') fixedValue: boolean;

  /**
   * Makes the footer sticky to the bottom of the window.
   * @param {boolean} val
   */
  @Input()
  set fixed(val: boolean) {
    this.fixedValue = convertToBoolProperty(val);
  }
  static ngAcceptInputType_fixed: DyBooleanInput;

}

import {
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import {
  DyComponentPortal,
  DyComponentType,
  DyOverlayPositionBuilder,
  DyOverlayRef,
} from '../cdk/overlay/mapping';
import { DyOverlayService } from '../cdk/overlay/overlay-service';
import { DyBlockScrollStrategyAdapter } from '../cdk/adapter/block-scroll-strategy-adapter';
import {
  DY_WINDOW_CONFIG,
  DY_WINDOW_CONTENT,
  DY_WINDOW_CONTEXT,
  DyWindowConfig,
  DyWindowState,
} from './window.options';
import { DyWindowRef } from './window-ref';
import { DyWindowsContainerComponent } from './windows-container.component';
import { DyWindowComponent } from './window.component';
import { DY_DOCUMENT } from '../../theme.options';

/**
 * The `DyWindowService` can be used to open windows.
 *
 * @stacked-example(Showcase, window/window-showcase.component)
 *
 * ### Installation
 *
 * Import `DyWindowModule` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyWindowModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * If you are using it in a lazy loaded module than you have to install `DyWindowModule.forChild`:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyWindowModule.forChild(config),
 *   ],
 * })
 * export class LazyLoadedModule { }
 * ```
 *
 * ### Usage
 *
 * A new window can be opened by calling the `open` method with a component or template to be loaded
 * and an optional configuration.
 * `open` method will return `DyWindowRef` that can be used for the further manipulations.
 *
 * ```ts
 * const windowRef = this.windowService.open(MyComponent, { ... });
 * ```
 *
 * `DyWindowRef` gives you ability manipulate opened window.
 * Also, you can inject `DyWindowRef` inside provided component which rendered in window.
 *
 * ```ts
 * this.windowService.open(MyWindowComponent, { ... });
 *
 * // my.component.ts
 * constructor(protected windowRef: DyWindowRef) {
 * }
 *
 * minimize() {
 *   this.windowRef.minimize();
 * }
 *
 * close() {
 *   this.windowRef.close();
 * }
 * ```
 *
 * Instead of component you can create window from TemplateRef. As usual you can access context provided via config
 * via `let-` variables. Also you can get reference to the `DyWindowRef` in context's `windowRef` property.
 *
 * @stacked-example(Window content from TemplateRef, window/template-window.component)
 *
 * ### Configuration
 *
 * As mentioned above, `open` method of the `DyWindowService` may receive optional configuration options.
 * Also, you can modify default windows configuration through `DyWindowModule.forRoot({ ... })`.
 * You can read about all available options on [API tab](docs/components/window/api#dywindowconfig).
 *
 * @stacked-example(Configuration, window/windows-backdrop.component)
 */
@Injectable()
export class DyWindowService {

  protected document: Document;
  protected overlayRef: DyOverlayRef;
  protected windowsContainerViewRef: ViewContainerRef;
  protected openWindows: DyWindowRef[] = [];

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected overlayService: DyOverlayService,
    protected overlayPositionBuilder: DyOverlayPositionBuilder,
    protected blockScrollStrategy: DyBlockScrollStrategyAdapter,
    @Inject(DY_WINDOW_CONFIG) protected readonly defaultWindowsConfig: DyWindowConfig,
    protected cfr: ComponentFactoryResolver,
    @Inject(DY_DOCUMENT) document,
  ) {
    this.document = document;
  }

  /**
   * Opens new window.
   * @param windowContent
   * @param windowConfig
   * */
  open(
    windowContent: TemplateRef<any> | DyComponentType,
    windowConfig: Partial<DyWindowConfig> = {},
  ): DyWindowRef {
    if (this.shouldCreateWindowsContainer()) {
      this.createWindowsContainer();
    }

    const config = new DyWindowConfig(this.defaultWindowsConfig, windowConfig);
    const windowRef = new DyWindowRef(config);
    windowRef.componentRef = this.appendWindow(windowContent, config, windowRef);

    this.openWindows.push(windowRef);
    this.subscribeToEvents(windowRef);

    return windowRef;
  }

  protected shouldCreateWindowsContainer(): boolean {
    if (this.windowsContainerViewRef) {
      const containerEl = this.windowsContainerViewRef.element.nativeElement;
      return !this.document.body.contains(containerEl);
    }

    return true;
  }

  protected createWindowsContainer() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    this.overlayRef = this.overlayService.create({
      scrollStrategy: this.overlayService.scrollStrategies.noop(),
      positionStrategy: this.overlayPositionBuilder.global().bottom().right(),
      hasBackdrop: true,
    });
    const windowsContainerPortal = new DyComponentPortal(DyWindowsContainerComponent, null, null, this.cfr);
    const overlayRef = this.overlayRef.attach(windowsContainerPortal);
    this.windowsContainerViewRef = overlayRef.instance.viewContainerRef;
  }

  protected appendWindow(
    content: TemplateRef<any> | DyComponentType,
    config: DyWindowConfig,
    windowRef: DyWindowRef,
  ): ComponentRef<DyWindowComponent> {
    const context = content instanceof TemplateRef
      ? { $implicit: config.context, windowRef }
      : config.context;

    const providers = [
      { provide: DY_WINDOW_CONTENT, useValue: content },
      { provide: DY_WINDOW_CONTEXT, useValue: context },
      { provide: DyWindowConfig, useValue: config },
      { provide: DyWindowRef, useValue: windowRef },
    ];
    const parentInjector = config.viewContainerRef
      ? config.viewContainerRef.injector
      : this.windowsContainerViewRef.injector;
    const injector = Injector.create({ parent: parentInjector, providers });
    const windowFactory = this.componentFactoryResolver.resolveComponentFactory(DyWindowComponent);

    const ref = this.windowsContainerViewRef.createComponent(windowFactory, null, injector);
    ref.instance.cfr = this.cfr;
    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  protected subscribeToEvents(windowRef: DyWindowRef) {
    if (windowRef.config.closeOnBackdropClick) {
      this.overlayRef.backdropClick().subscribe(() => windowRef.close());
    }

    if (windowRef.config.closeOnEsc) {
      this.overlayRef.keydownEvents()
        .pipe(filter((event: KeyboardEvent) => event.keyCode === 27))
        .subscribe(() => windowRef.close());
    }

    windowRef.stateChange.subscribe(() => this.checkAndUpdateOverlay());

    windowRef.onClose.subscribe(() => {
      this.openWindows.splice(this.openWindows.indexOf(windowRef), 1);
      this.checkAndUpdateOverlay();
    });
  }

  protected checkAndUpdateOverlay() {
    const fullScreenWindows = this.openWindows.filter(w => w.state === DyWindowState.FULL_SCREEN);
    if (fullScreenWindows.length > 0) {
      this.blockScrollStrategy.enable();
    } else {
      this.blockScrollStrategy.disable();
    }

    if (fullScreenWindows.some(w => w.config.hasBackdrop)) {
      this.overlayRef.backdropElement.removeAttribute('hidden');
    } else {
      this.overlayRef.backdropElement.setAttribute('hidden', '');
    }
  }
}

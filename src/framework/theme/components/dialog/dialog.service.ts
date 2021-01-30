

import { ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  DyComponentPortal,
  DyOverlayRef,
  DyPortalInjector,
  DyScrollStrategy,
  DyTemplatePortal,
} from '../cdk/overlay/mapping';
import { DyGlobalPositionStrategy, DyPositionBuilderService } from '../cdk/overlay/overlay-position';
import { DyOverlayService } from '../cdk/overlay/overlay-service';
import { DY_DOCUMENT } from '../../theme.options';
import { DY_DIALOG_CONFIG, DyDialogConfig } from './dialog-config';
import { DyDialogRef } from './dialog-ref';
import { DyDialogContainerComponent } from './dialog-container';


/**
 * The `DyDialogService` helps to open dialogs.
 *
 * @stacked-example(Showcase, dialog/dialog-showcase.component)
 *
 * A new dialog is opened by calling the `open` method with a component to be loaded and an optional configuration.
 * `open` method will return `DyDialogRef` that can be used for the further manipulations.
 *
 * ### Installation
 *
 * Import `DyDialogModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyDialogModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * If you are using it in a lazy loaded module than you have to install it with `DyDialogModule.forChild()`:
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyDialogModule.forChild(config),
 *   ],
 * })
 * export class LazyLoadedModule { }
 * ```
 *
 * ### Usage
 *
 * ```ts
 * const dialogRef = this.dialogService.open(MyDialogComponent, { ... });
 * ```
 *
 * `DyDialogRef` gives capability access reference to the rendered dialog component,
 * destroy dialog and some other options described below.
 *
 * Also, you can inject `DyDialogRef` in dialog component.
 *
 * ```ts
 * this.dialogService.open(MyDialogComponent, { ... });
 *
 * // my-dialog.component.ts
 * constructor(protected dialogRef: DyDialogRef) {
 * }
 *
 * close() {
 *   this.dialogRef.close();
 * }
 * ```
 *
 * Instead of component you can create dialog from TemplateRef:
 *
 * @stacked-example(Template ref, dialog/dialog-template.component)
 *
 * The dialog may return result through `DyDialogRef`. Calling component can receive this result with `onClose`
 * stream of `DyDialogRef`.
 *
 * @stacked-example(Result, dialog/dialog-result.component)
 *
 * ### Configuration
 *
 * As we mentioned above, `open` method of the `DyDialogService` may receive optional configuration options.
 * Also, you can provide global dialogs configuration through `DyDialogModule.forRoot({ ... })`.
 *
 * This config may contain the following:
 *
 * `context` - both, template and component may receive data through `config.context` property.
 * For components, this data will be assigned through inputs.
 * For templates, you can access it inside template as $implicit.
 *
 * ```ts
 * this.dialogService.open(template, { context: 'pass data in template' });
 * ```
 *
 * ```html
 * <ng-template let-some-additional-data>
 *   {{ some-additional-data }}
 * <ng-template/>
 * ```
 *
 * `hasBackdrop` - determines is service have to render backdrop under the dialog.
 * Default is true.
 * @stacked-example(Backdrop, dialog/dialog-has-backdrop.component)
 *
 * `closeOnBackdropClick` - close dialog on backdrop click if true.
 * Default is true.
 * @stacked-example(Backdrop click, dialog/dialog-backdrop-click.component)
 *
 * `closeOnEsc` - close dialog on escape button on the keyboard.
 * Default is true.
 * @stacked-example(Escape hit, dialog/dialog-esc.component)
 *
 * `hasScroll` - Disables scroll on content under dialog if true and does nothing otherwise.
 * Default is false.
 * Please, open dialogs in the separate window and try to scroll.
 * @stacked-example(Scroll, dialog/dialog-scroll.component)
 *
 * `autoFocus` - Focuses dialog automatically after open if true. It's useful to prevent misclicks on
 * trigger elements and opening multiple dialogs.
 * Default is true.
 *
 * As you can see, if you open dialog with auto focus dialog will focus first focusable element
 * or just blur previously focused automatically.
 * Otherwise, without auto focus, the focus will stay on the previously focused element.
 * Please, open dialogs in the separate window and try to click on the button without focus
 * and then hit space any times. Multiple same dialogs will be opened.
 * @stacked-example(Auto focus, dialog/dialog-auto-focus.component)
 * */
@Injectable()
export class DyDialogService {
  constructor(@Inject(DY_DOCUMENT) protected document,
              @Inject(DY_DIALOG_CONFIG) protected globalConfig,
              protected positionBuilder: DyPositionBuilderService,
              protected overlay: DyOverlayService,
              protected injector: Injector,
              protected cfr: ComponentFactoryResolver) {
  }

  /**
   * Opens new instance of the dialog, may receive optional config.
   * */
  open<T>(content: Type<T> | TemplateRef<T>,
          userConfig: Partial<DyDialogConfig<Partial<T> | string>> = {}): DyDialogRef<T> {
    const config = new DyDialogConfig({ ...this.globalConfig, ...userConfig });
    const overlayRef = this.createOverlay(config);
    const dialogRef = new DyDialogRef<T>(overlayRef);
    const container = this.createContainer(config, overlayRef);
    this.createContent(config, content, container, dialogRef);

    this.registerCloseListeners(config, overlayRef, dialogRef);

    return dialogRef;
  }

  protected createOverlay(config: DyDialogConfig): DyOverlayRef {
    const positionStrategy = this.createPositionStrategy();
    const scrollStrategy = this.createScrollStrategy(config.hasScroll);

    return this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.dialogClass,
    });
  }

  protected createPositionStrategy(): DyGlobalPositionStrategy {
    return this.positionBuilder
      .global()
      .centerVertically()
      .centerHorizontally();
  }

  protected createScrollStrategy(hasScroll: boolean): DyScrollStrategy {
    if (hasScroll) {
      return this.overlay.scrollStrategies.noop();
    } else {
      return this.overlay.scrollStrategies.block();
    }
  }

  protected createContainer(config: DyDialogConfig, overlayRef: DyOverlayRef): DyDialogContainerComponent {
    const injector = new DyPortalInjector(this.createInjector(config), new WeakMap([[DyDialogConfig, config]]));
    const containerPortal = new DyComponentPortal(DyDialogContainerComponent, null, injector, this.cfr);
    const containerRef = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  protected createContent<T>(config: DyDialogConfig,
                             content: Type<T> | TemplateRef<T>,
                             container: DyDialogContainerComponent,
                             dialogRef: DyDialogRef<T>) {
    if (content instanceof TemplateRef) {
      const portal = this.createTemplatePortal(config, content, dialogRef);
      container.attachTemplatePortal(portal);
    } else {
      const portal = this.createComponentPortal(config, content, dialogRef);
      dialogRef.componentRef = container.attachComponentPortal(portal);

      if (config.context) {
        Object.assign(dialogRef.componentRef.instance, { ...config.context })
      }
    }
  }

  protected createTemplatePortal<T>(config: DyDialogConfig,
                                    content: TemplateRef<T>,
                                    dialogRef: DyDialogRef<T>): DyTemplatePortal {
    return new DyTemplatePortal(content, null, <any>{ $implicit: config.context, dialogRef });
  }

  /**
   * We're creating portal with custom injector provided through config or using global injector.
   * This approach provides us capability inject `DyDialogRef` in dialog component.
   * */
  protected createComponentPortal<T>(config: DyDialogConfig,
                                     content: Type<T>,
                                     dialogRef: DyDialogRef<T>): DyComponentPortal {
    const injector = this.createInjector(config);
    const portalInjector = new DyPortalInjector(injector, new WeakMap([[DyDialogRef, dialogRef]]));
    return new DyComponentPortal(content, config.viewContainerRef, portalInjector);
  }

  protected createInjector(config: DyDialogConfig): Injector {
    return config.viewContainerRef && config.viewContainerRef.injector || this.injector;
  }

  protected registerCloseListeners<T>(config: DyDialogConfig, overlayRef: DyOverlayRef, dialogRef: DyDialogRef<T>) {
    if (config.closeOnBackdropClick) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
    }

    if (config.closeOnEsc) {
      observableFromEvent(this.document, 'keyup')
        .pipe(
          filter((event: KeyboardEvent) => event.keyCode === 27),
          takeUntil(dialogRef.onClose),
        )
        .subscribe(() => dialogRef.close());
    }
  }
}

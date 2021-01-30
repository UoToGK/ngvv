

import { ComponentFactoryResolver, ComponentRef, Inject, Injectable } from '@angular/core';

import { DyComponentPortal, DyOverlayRef } from '../cdk/overlay/mapping';
import { DyOverlayService, patch } from '../cdk/overlay/overlay-service';
import { DyPositionBuilderService } from '../cdk/overlay/overlay-position';
import { DyGlobalLogicalPosition, DyGlobalPosition, DyPositionHelper } from '../cdk/overlay/position-helper';
import { DyToastrContainerComponent } from './toastr-container.component';
import { DY_TOASTR_CONFIG, DyToastrConfig } from './toastr-config';
import { DyToast } from './model';
import { DyToastComponent } from './toast.component';
import { DY_DOCUMENT } from '../../theme.options';

export class DyToastRef {
  constructor(private toastContainer: DyToastContainer,
              private toast: DyToast) {
  }

  close() {
    this.toastContainer.destroy(this.toast);
  }
}

export class DyToastContainer {
  protected toasts: DyToast[] = [];
  protected prevToast: DyToast;

  get nativeElement() {
    return this.containerRef.location.nativeElement;
  }

  constructor(protected position: DyGlobalPosition,
              protected containerRef: ComponentRef<DyToastrContainerComponent>,
              protected positionHelper: DyPositionHelper) {
  }

  attach(toast: DyToast): DyToastRef {
    if (toast.config.preventDuplicates && this.isDuplicate(toast)) {
      return;
    }

    this.removeToastIfLimitReached(toast);
    const toastComponent: DyToastComponent = this.attachToast(toast);

    if (toast.config.destroyByClick) {
      this.subscribeOnClick(toastComponent, toast);
    }

    if (toast.config.duration) {
      this.setDestroyTimeout(toast);
    }

    this.prevToast = toast;

    return new DyToastRef(this, toast);
  }

  destroy(toast: DyToast) {
    if (this.prevToast === toast) {
      this.prevToast = null;
    }

    this.toasts = this.toasts.filter(t => t !== toast);
    this.updateContainer();
  }

  protected isDuplicate(toast: DyToast): boolean {
    return toast.config.duplicatesBehaviour === 'previous'
      ? this.isDuplicatePrevious(toast)
      : this.isDuplicateAmongAll(toast);
  }

  protected isDuplicatePrevious(toast: DyToast): boolean {
    return this.prevToast && this.toastDuplicateCompareFunc(this.prevToast, toast);
  }

  protected isDuplicateAmongAll(toast: DyToast): boolean {
    return this.toasts.some(t => this.toastDuplicateCompareFunc(t, toast));
  }

  protected toastDuplicateCompareFunc = (t1: DyToast, t2: DyToast): boolean => {
    return t1.message === t2.message
      && t1.title === t2.title
      && t1.config.status === t2.config.status;
  };

  protected removeToastIfLimitReached(toast: DyToast) {
    if (!toast.config.limit || this.toasts.length < toast.config.limit) {
      return;
    }
    if (this.positionHelper.isTopPosition(toast.config.position)) {
      this.toasts.pop();
    } else {
      this.toasts.shift();
    }
  }

  protected attachToast(toast: DyToast): DyToastComponent {
    if (this.positionHelper.isTopPosition(toast.config.position)) {
      return this.attachToTop(toast);
    } else {
      return this.attachToBottom(toast);
    }
  }

  protected attachToTop(toast: DyToast): DyToastComponent {
    this.toasts.unshift(toast);
    this.updateContainer();
    return this.containerRef.instance.toasts.first;
  }

  protected attachToBottom(toast: DyToast): DyToastComponent {
    this.toasts.push(toast);
    this.updateContainer();
    return this.containerRef.instance.toasts.last;
  }

  protected setDestroyTimeout(toast: DyToast) {
    setTimeout(() => this.destroy(toast), toast.config.duration);
  }

  protected subscribeOnClick(toastComponent: DyToastComponent, toast: DyToast) {
    toastComponent.destroy.subscribe(() => this.destroy(toast));
  }

  protected updateContainer() {
    patch(this.containerRef, { content: this.toasts, position: this.position });
  }
}

interface DyToastrOverlayWithContainer {
  overlayRef: DyOverlayRef;
  toastrContainer: DyToastContainer;
}

@Injectable()
export class DyToastrContainerRegistry {
  protected overlays: Map<DyGlobalPosition, DyToastrOverlayWithContainer> = new Map();

  constructor(protected overlay: DyOverlayService,
              protected positionBuilder: DyPositionBuilderService,
              protected positionHelper: DyPositionHelper,
              protected cfr: ComponentFactoryResolver,
              @Inject(DY_DOCUMENT) protected document: any) {
  }

  get(position: DyGlobalPosition): DyToastContainer {
    const logicalPosition: DyGlobalLogicalPosition = this.positionHelper.toLogicalPosition(position);

    const overlayWithContainer = this.overlays.get(logicalPosition);
    if (!overlayWithContainer || !this.existsInDom(overlayWithContainer.toastrContainer)) {
      if (overlayWithContainer) {
        overlayWithContainer.overlayRef.dispose();
      }
      this.instantiateContainer(logicalPosition);
    }

    return this.overlays.get(logicalPosition).toastrContainer;
  }

  protected instantiateContainer(position: DyGlobalLogicalPosition) {
    const toastrOverlayWithContainer = this.createContainer(position);
    this.overlays.set(position, toastrOverlayWithContainer);
  }

  protected createContainer(position: DyGlobalLogicalPosition): DyToastrOverlayWithContainer {
    const positionStrategy = this.positionBuilder.global().position(position);
    const ref = this.overlay.create({ positionStrategy });
    this.addClassToOverlayHost(ref);
    const containerRef = ref.attach(new DyComponentPortal(DyToastrContainerComponent, null, null, this.cfr));
    return {
      overlayRef: ref,
      toastrContainer: new DyToastContainer(position, containerRef, this.positionHelper),
    };
  }

  protected addClassToOverlayHost(overlayRef: DyOverlayRef) {
    overlayRef.hostElement.classList.add('toastr-overlay-container');
  }

  protected existsInDom(toastContainer: DyToastContainer): boolean {
    return this.document.body.contains(toastContainer.nativeElement);
  }
}

/**
 * The `DyToastrService` provides a capability to build toast notifications.
 *
 * @stacked-example(Showcase, toastr/toastr-showcase.component)
 *
 * `DyToastrService.show(message, title, config)` accepts three params, title and config are optional.
 *
 * ### Installation
 *
 * Import `DyToastrModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     DyToastrModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * ### Usage
 *
 * Calling `DyToastrService.show(...)` will render new toast and return `DyToastrRef` with
 * help of which you may close newly created toast by calling `close` method.
 *
 * ```ts
 * const toastRef: DyToastRef = this.toastrService.show(...);
 * toastRef.close();
 * ```
 *
 * Config accepts following options:
 *
 * `position` - determines where on the screen toast will be rendered.
 * Default is `top-end`.
 *
 * @stacked-example(Position, toastr/toastr-positions.component)
 *
 * `status` - coloring and icon of the toast.
 * Default is `basic`.
 *
 * @stacked-example(Status, toastr/toastr-statuses.component)
 *
 * `duration` - the time after which the toast will be destroyed.
 * `0` means endless toast, that may be destroyed by click only.
 * Default is 3000 ms.
 *
 * @stacked-example(Duration, toastr/toastr-duration.component)
 *
 * `destroyByClick` - provides a capability to destroy toast by click.
 * Default is true.
 *
 * @stacked-example(Destroy by click, toastr/toastr-destroy-by-click.component)
 *
 * `preventDuplicates` - don't create new toast if it has the same title, message and status.
 * Default is false.
 *
 * @stacked-example(Prevent duplicates, toastr/toastr-prevent-duplicates.component)
 *
 * `duplicatesBehaviour` - determines how to treat the toasts duplication.
 * Compare with the previous message `previous`
 * or with all visible messages `all`.
 *
 * @stacked-example(Prevent duplicates behaviour , toastr/toastr-prevent-duplicates-behaviour.component)
 *
 * `limit` - the number of visible toasts in the toast container. The number of toasts is unlimited by default.
 *
 * @stacked-example(Prevent duplicates behaviour , toastr/toastr-limit.component)
 *
 * `hasIcon` - if true then render toast icon.
 * `icon` - you can pass icon class that will be applied into the toast.
 *
 * @stacked-example(Has icon, toastr/toastr-icon.component)
 * */
@Injectable()
export class DyToastrService {
  constructor(@Inject(DY_TOASTR_CONFIG) protected globalConfig: DyToastrConfig,
              protected containerRegistry: DyToastrContainerRegistry) {
  }

  /**
   * Shows toast with message, title and user config.
   * */
  show(message, title?, userConfig?: Partial<DyToastrConfig>): DyToastRef {
    const config = new DyToastrConfig({ ...this.globalConfig, ...userConfig });
    const container = this.containerRegistry.get(config.position);
    const toast = { message, title, config };
    return container.attach(toast);
  }

  /**
   * Shows success toast with message, title and user config.
   * */
  success(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'success' });
  }

  /**
   * Shows info toast with message, title and user config.
   * */
  info(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'info' });
  }

  /**
   * Shows warning toast with message, title and user config.
   * */
  warning(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'warning' });
  }

  /**
   * Shows primary toast with message, title and user config.
   * */
  primary(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'primary' });
  }

  /**
   * Shows danger toast with message, title and user config.
   * */
  danger(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'danger' });
  }

  /**
   * Shows default toast with message, title and user config.
   * */
  default(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.show(message, title, { ...config, status: 'basic' });
  }

  /**
   * Shows control toast with message, title and user config.
   * */
  control(message, title?, config?: Partial<DyToastrConfig>): DyToastRef {
    return this.default(message, title, { ...config, status: 'control' });
  }
}

import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type } from '@angular/core';
import { filter, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, merge } from 'rxjs';

import {
  DyAdjustableConnectedPositionStrategy,
  DyPosition,
} from '../overlay-position';

import { DyRenderableContainer } from '../overlay-container';
import { createContainer, DyOverlayContent, DyOverlayService, patch } from '../overlay-service';
import { DyOverlayRef, DyOverlayContainer, DyOverlayConfig } from '../mapping';

export interface DyDynamicOverlayController {
  show();
  hide();
  toggle();
  rebuild();
}

@Injectable()
export class DyDynamicOverlay {

  protected ref: DyOverlayRef;
  protected container: ComponentRef<DyRenderableContainer>;
  protected componentType: Type<DyRenderableContainer>;
  protected context: Object = {};
  protected content: DyOverlayContent;
  protected positionStrategy: DyAdjustableConnectedPositionStrategy;
  protected overlayConfig: DyOverlayConfig = {};
  protected lastAppliedPosition: DyPosition;

  protected positionStrategyChange$ = new Subject();
  protected isShown$ = new BehaviorSubject<boolean>(false);
  protected destroy$ = new Subject<void>();
  protected overlayDestroy$ = new Subject<DyOverlayRef>();

  get isAttached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  get isShown(): Observable<boolean> {
    return this.isShown$.pipe(distinctUntilChanged());
  }

  constructor(
    protected overlay: DyOverlayService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected zone: NgZone,
    protected overlayContainer: DyOverlayContainer) {
  }

  create(componentType: Type<DyRenderableContainer>,
         content: DyOverlayContent,
         context: Object,
         positionStrategy: DyAdjustableConnectedPositionStrategy,
         overlayConfig: DyOverlayConfig = {}) {

    this.setContentAndContext(content, context);
    this.setComponent(componentType);
    this.setPositionStrategy(positionStrategy);
    this.setOverlayConfig(overlayConfig);

    return this;
  }

  setContent(content: DyOverlayContent) {
    this.content = content;

    if (this.container) {
      this.updateContext();
    }
    this.updatePosition();
  }

  setContext(context: Object) {
    this.context = context;

    if (this.container) {
      this.updateContext();
    }
    this.updatePosition();
  }

  setContentAndContext(content: DyOverlayContent, context: Object) {
    this.content = content;
    this.context = context;
    if (this.container) {
      this.updateContext();
    }
    this.updatePosition();
  }

  setComponent(componentType: Type<DyRenderableContainer>) {
    this.componentType = componentType;

    // in case the component is shown we recreate it and show it back
    const wasAttached = this.isAttached;
    this.disposeOverlayRef();
    if (wasAttached) {
      this.show();
    }
  }

  setPositionStrategy(positionStrategy: DyAdjustableConnectedPositionStrategy) {
    this.positionStrategyChange$.next();

    this.positionStrategy = positionStrategy;

    this.positionStrategy.positionChange
      .pipe(
        filter(() => !!this.container),
        takeUntil(
          merge(
            this.positionStrategyChange$,
            this.destroy$,
          ),
        ),
      )
      .subscribe((position: DyPosition) => {
        this.lastAppliedPosition = position;
        patch(this.container, { position });
      });

    if (this.ref) {
      this.ref.updatePositionStrategy(this.positionStrategy);
    }
  }

  setOverlayConfig(overlayConfig: DyOverlayConfig) {
    this.overlayConfig = overlayConfig;

    const wasAttached = this.isAttached;
    this.disposeOverlayRef();
    if (wasAttached) {
      this.show();
    }
  }

  show() {
    if (!this.ref) {
      this.createOverlay();
    }

    this.renderContainer();

    if (!this.hasOverlayInContainer()) {
      // Dispose overlay ref as it refers to the old overlay container and create new by calling `show`
      this.disposeOverlayRef();
      return this.show();
    }

    this.isShown$.next(true);
  }

  hide() {
    if (!this.ref) {
      return;
    }

    this.ref.detach();
    this.container = null;

    this.isShown$.next(false);
  }

  toggle() {
    if (this.isAttached) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.destroy$.next();
    this.destroy$.complete();
    this.hide();
    this.disposeOverlayRef();
    this.isShown$.complete();
    this.positionStrategyChange$.complete();
    this.overlayDestroy$.complete();
  }

  getContainer() {
    return this.container;
  }

  protected createOverlay() {
    this.ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      ...this.overlayConfig,
    });
    this.updatePositionWhenStable(this.ref);
  }

  protected renderContainer() {
    const containerContext = this.createContainerContext();
    if (!this.container) {
      this.container = createContainer(this.ref, this.componentType, containerContext, this.componentFactoryResolver);
    }
    this.container.instance.renderContent();
  }

  protected updateContext() {
    const containerContext = this.createContainerContext();
    Object.assign(this.container.instance, containerContext);
    this.container.instance.renderContent();
    this.container.changeDetectorRef.detectChanges();
  }

  protected createContainerContext(): Object {
    return {
      content: this.content,
      context: this.context,
      cfr: this.componentFactoryResolver,
      position: this.lastAppliedPosition,
    };
  }

  /**
   * Dimensions of the container may change after content update. So we listen to zone.stable event to
   * reposition the container.
   */
  protected updatePositionWhenStable(overlay: DyOverlayRef) {
    const overlayDestroy$ = this.overlayDestroy$.pipe(
      filter((destroyedOverlay: DyOverlayRef) => destroyedOverlay === overlay),
    );

    this.zone.onStable
      .pipe(takeUntil(merge(this.destroy$, overlayDestroy$)))
      .subscribe(() => this.updatePosition());
  }

  protected updatePosition() {
    if (this.ref) {
      this.ref.updatePosition();
    }
  }

  protected hasOverlayInContainer(): boolean {
    return this.overlayContainer.getContainerElement().contains(this.ref.hostElement);
  }

  protected disposeOverlayRef() {
    if (this.ref) {
      this.ref.dispose();
      this.overlayDestroy$.next(this.ref);
      this.ref = null;
      this.container = null;
    }
  }
}

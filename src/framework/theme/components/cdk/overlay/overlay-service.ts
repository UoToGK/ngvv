import { ComponentFactoryResolver, ComponentRef, Injectable, TemplateRef, Type } from '@angular/core';

import {
  DyComponentPortal,
  DyComponentType,
  DyOverlay,
  DyOverlayConfig,
  DyOverlayRef,
} from './mapping';
import { DyScrollStrategyOptions } from '../adapter/block-scroll-strategy-adapter';
import { DyLayoutDirectionService } from '../../../services/direction.service';


export type DyOverlayContent = Type<any> | TemplateRef<any> | string;

export function patch<T>(container: ComponentRef<T>, containerContext: Object): ComponentRef<T> {
  Object.assign(container.instance, containerContext);
  container.changeDetectorRef.detectChanges();
  return container;
}

export function createContainer<T>(
  ref: DyOverlayRef,
  container: DyComponentType<T>,
  context: Object,
  componentFactoryResolver?: ComponentFactoryResolver,
  ): ComponentRef<T> {
  const containerRef = ref.attach(new DyComponentPortal(container, null, null, componentFactoryResolver));
  patch(containerRef, context);
  return containerRef;
}

@Injectable()
export class DyOverlayService {
  constructor(protected overlay: DyOverlay, protected layoutDirection: DyLayoutDirectionService) {
  }

  get scrollStrategies(): DyScrollStrategyOptions {
    return this.overlay.scrollStrategies;
  }

  create(config?: DyOverlayConfig): DyOverlayRef {
    const overlayRef = this.overlay.create(config);
    this.layoutDirection.onDirectionChange()
      .subscribe(dir => overlayRef.setDirection(dir));
    return overlayRef;
  }
}

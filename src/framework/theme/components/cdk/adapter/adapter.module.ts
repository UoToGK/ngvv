import { ModuleWithProviders, NgModule } from '@angular/core';
import { OverlayContainer, ScrollDispatcher, ScrollStrategyOptions } from '@angular/cdk/overlay';

import { DyOverlayContainer } from '../overlay/mapping';
import { DyOverlayContainerAdapter } from './overlay-container-adapter';
import { DyScrollDispatcherAdapter } from './scroll-dispatcher-adapter';
import { DyViewportRulerAdapter } from './viewport-ruler-adapter';
import { DyBlockScrollStrategyAdapter, DyScrollStrategyOptions } from './block-scroll-strategy-adapter';


@NgModule({})
export class DyCdkAdapterModule {
  static forRoot(): ModuleWithProviders<DyCdkAdapterModule> {
    return {
      ngModule: DyCdkAdapterModule,
      providers: [
        DyViewportRulerAdapter,
        DyOverlayContainerAdapter,
        DyBlockScrollStrategyAdapter,
        DyScrollDispatcherAdapter,
        DyScrollStrategyOptions,
        { provide: OverlayContainer, useExisting: DyOverlayContainerAdapter },
        { provide: DyOverlayContainer, useExisting: DyOverlayContainerAdapter },
        { provide: ScrollDispatcher, useExisting: DyScrollDispatcherAdapter },
        { provide: ScrollStrategyOptions, useExisting: DyScrollStrategyOptions },
      ],
    };
  }
}

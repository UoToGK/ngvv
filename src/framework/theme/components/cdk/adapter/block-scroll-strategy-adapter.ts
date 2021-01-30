import { Inject, Injectable, NgZone } from '@angular/core';
import { BlockScrollStrategy, ScrollDispatcher, ScrollStrategyOptions } from '@angular/cdk/overlay';

import { DyLayoutScrollService } from '../../../services/scroll.service';
import { DY_DOCUMENT } from '../../../theme.options';
import { DyViewportRulerAdapter } from './viewport-ruler-adapter';


/**
 * Overrides default block scroll strategy because default strategy blocks scrolling on the body only.
 * But Nebular has its own scrollable container - dy-layout. So, we need to block scrolling in it to.
 * */
@Injectable()
export class DyBlockScrollStrategyAdapter extends BlockScrollStrategy {
  constructor(@Inject(DY_DOCUMENT) document: any,
              viewportRuler: DyViewportRulerAdapter,
              protected scrollService: DyLayoutScrollService) {
    super(viewportRuler, document);
  }

  enable() {
    super.enable();
    this.scrollService.scrollable(false);
  }

  disable() {
    super.disable();
    this.scrollService.scrollable(true);
  }
}

@Injectable()
export class DyScrollStrategyOptions extends ScrollStrategyOptions {
  constructor(protected scrollService: DyLayoutScrollService,
              protected scrollDispatcher: ScrollDispatcher,
              protected viewportRuler: DyViewportRulerAdapter,
              protected ngZone: NgZone,
              @Inject(DY_DOCUMENT) protected document) {
    super(scrollDispatcher, viewportRuler, ngZone, document);
  }

  block = () => new DyBlockScrollStrategyAdapter(this.document, this.viewportRuler, this.scrollService);
}

export type DyScrollStrategies = keyof Pick<DyScrollStrategyOptions, 'noop' | 'close' | 'block' | 'reposition'>;

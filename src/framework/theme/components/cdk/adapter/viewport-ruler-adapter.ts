import { Inject, Injectable, NgZone } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/overlay';
import { map } from 'rxjs/operators';

import { DyPlatform } from '../platform/platform-service';
import { DyLayoutRulerService } from '../../../services/ruler.service';
import { DyLayoutScrollService, DyScrollPosition } from '../../../services/scroll.service';
import { DY_DOCUMENT } from '../../../theme.options';


@Injectable()
export class DyViewportRulerAdapter extends ViewportRuler {
  constructor(platform: DyPlatform, ngZone: NgZone,
              protected ruler: DyLayoutRulerService,
              protected scroll: DyLayoutScrollService,
              @Inject(DY_DOCUMENT) document: any) {
    super(platform, ngZone, document);
  }

  getViewportSize(): Readonly<{ width: number; height: number; }> {
    let res;
    /*
    * getDimensions call is really synchronous operation.
    * And we have to conform with the interface of the original service.
    * */
    this.ruler.getDimensions()
      .pipe(map(dimensions => ({ width: dimensions.clientWidth, height: dimensions.clientHeight })))
      .subscribe(rect => res = rect);
    return res;
  }

  getViewportScrollPosition(): { left: number; top: number } {
    let res;
    /*
    * getPosition call is really synchronous operation.
    * And we have to conform with the interface of the original service.
    * */
    this.scroll.getPosition()
      .pipe(map((position: DyScrollPosition) => ({ top: position.y, left: position.x })))
      .subscribe(position => res = position);
    return res;
  }
}

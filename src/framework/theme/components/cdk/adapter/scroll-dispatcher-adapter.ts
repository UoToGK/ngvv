import { Inject, Injectable, NgZone } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { DyPlatform } from '../platform/platform-service';
import { DyLayoutScrollService } from '../../../services/scroll.service';
import { DY_DOCUMENT } from '../../../theme.options';

@Injectable()
export class DyScrollDispatcherAdapter extends ScrollDispatcher {
  constructor(ngZone: NgZone,
              platform: DyPlatform,
              protected scrollService: DyLayoutScrollService,
              @Inject(DY_DOCUMENT) document: any) {
    super(ngZone, platform, document);
  }

  scrolled(auditTimeInMs?: number): Observable<CdkScrollable | void> {
    return this.scrollService.onScroll();
  }
}


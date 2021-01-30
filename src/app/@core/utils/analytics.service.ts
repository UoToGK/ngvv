import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DY_WINDOW } from 'src/framework/theme/public_api';

@Injectable()
export class AnalyticsService {
  private enabled = false;

  constructor(@Inject(DY_WINDOW) private window,
              private location: Location,
              private router: Router) {
    this.enabled = this.window.location.href.indexOf('akveo.com') >= 0;
  }

  trackPageViews() {
    if (this.enabled) {
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
      )
        .subscribe(() => {
          this.gtmPushToDataLayer({event: 'pageView' , path: this.location.path()});
        });
    }
  }

  trackEvent(eventName: string, eventVal: string = '') {
    if (this.enabled) {
      this.gtmPushToDataLayer({ event: eventName, eventValue: eventVal });
    }
  }

  private gtmPushToDataLayer(params) {
    this.window.dataLayer.push(params);
  }
}

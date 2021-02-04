import { Component, OnDestroy } from '@angular/core';
import { DyThemeService, DyMediaBreakpoint, DyMediaBreakpointsService } from 'src/framework/theme/public_api';

@Component({
  selector: 'ngx-typography',
  styleUrls: ['./typography.component.scss'],
  templateUrl: './typography.component.html',
})
export class TypographyComponent implements OnDestroy {
  breakpoint: DyMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;

  constructor(private themeService: DyThemeService,
              private breakpointService: DyMediaBreakpointsService) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}

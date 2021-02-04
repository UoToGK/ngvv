import { Component, HostBinding, OnDestroy } from '@angular/core';
import { DyThemeService, DyMediaBreakpoint, DyMediaBreakpointsService } from 'src/framework/theme/public_api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-rooms',
  styleUrls: ['./rooms.component.scss'],
  template: `
    <dy-card [size]="breakpoint.width >= breakpoints.sm ? 'giant' : ''">
      <dy-icon icon="arrow-ios-downward" pack="eva"
               (click)="collapse()"
               class="collapse"
               [hidden]="isCollapsed()">
      </dy-icon>
      <ngx-room-selector [class.dark-background]="isDarkTheme" (select)="select($event)"></ngx-room-selector>
      <ngx-player [collapsed]="isCollapsed() && breakpoint.width <= breakpoints.md"></ngx-player>
    </dy-card>
  `,
})
export class RoomsComponent implements OnDestroy {

  @HostBinding('class.expanded')
  private expanded: boolean;
  private selected: number;

  isDarkTheme: boolean;

  breakpoint: DyMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  themeChangeSubscription: any;

  constructor(private themeService: DyThemeService,
              private breakpointService: DyMediaBreakpointsService) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([, newValue]) => {
        this.breakpoint = newValue;
      });

    this.themeChangeSubscription = this.themeService.onThemeChange()
      .pipe(map(({ name }) => name === 'cosmic' || name === 'dark'))
      .subscribe((isDark: boolean) => this.isDarkTheme = isDark);
  }

  select(roomNumber) {
    if (this.isSelected(roomNumber)) {
      this.expand();
    } else {
      this.collapse();
    }

    this.selected = roomNumber;
  }

  expand() {
    this.expanded = true;
  }

  collapse() {
    this.expanded = false;
  }

  isCollapsed() {
    return !this.expanded;
  }

  private isSelected(roomNumber): boolean {
    return this.selected === roomNumber;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.themeChangeSubscription.unsubscribe();
  }
}

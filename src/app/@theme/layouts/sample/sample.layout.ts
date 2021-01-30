import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, withLatestFrom, takeUntil } from 'rxjs/operators';
import {
  DyLayoutComponent,
  DyMediaBreakpoint,
  DyMediaBreakpointsService,
  DyMenuItem,
  DyMenuService,
  DySidebarService,
  DyThemeService,
} from 'src/framework/theme/public_api';

import { StateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <dy-layout [center]="layout.id === 'center-column'" windowMode>
      <dy-layout-header fixed>
        <ngx-header></ngx-header>
        <ngx-toggle-settings-button></ngx-toggle-settings-button>
      </dy-layout-header>

      <dy-sidebar class="menu-sidebar"
                  tag="menu-sidebar"
                  responsive
                  [end]="isMenuSidebarPositionEnd()">
        <ng-content select="dy-menu"></ng-content>
      </dy-sidebar>

      <dy-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </dy-layout-column>

      <dy-layout-column start class="small" *ngIf="layout.id === 'two-column' || layout.id === 'three-column'">
        <dy-menu [items]="subMenu"></dy-menu>
      </dy-layout-column>

      <dy-layout-column class="small" *ngIf="layout.id === 'three-column'">
        <dy-menu [items]="subMenu"></dy-menu>
      </dy-layout-column>

      <dy-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </dy-layout-footer>

      <dy-sidebar class="settings-sidebar"
                  tag="settings-sidebar"
                  state="collapsed"
                  fixed
                  [end]="isSettingsSidebarPositionEnd()">
        <ngx-theme-settings></ngx-theme-settings>
      </dy-sidebar>
    </dy-layout>
  `,
})
export class SampleLayoutComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  subMenu: DyMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
      group: true,
    },
    {
      title: 'Buttons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/buttons',
    },
    {
      title: 'Grid',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/grid',
    },
    {
      title: 'Icons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/icons',
    },
    {
      title: 'Modals',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/modals',
    },
    {
      title: 'Typography',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/typography',
    },
    {
      title: 'Animated Searches',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/search-fields',
    },
    {
      title: 'Tabs',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/tabs',
    },
  ];
  layout: any = {};
  sidebar: any = {};

  currentTheme: string;

  @ViewChild(DyLayoutComponent, { static: false }) layoutComponent: DyLayoutComponent;

  constructor(protected stateService: StateService,
              protected menuService: DyMenuService,
              protected themeService: DyThemeService,
              protected bpService: DyMediaBreakpointsService,
              protected sidebarService: DySidebarService,
              @Inject(PLATFORM_ID) protected platformId,
  ) {}

  ngOnInit() {
    this.stateService.onLayoutState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => this.layout = layout);

    this.stateService.onSidebarState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sidebar => this.sidebar = sidebar);

    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
      .pipe(
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
        takeUntil(this.destroy$),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [DyMediaBreakpoint, DyMediaBreakpoint]]) => {

        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    this.themeService.getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => this.currentTheme = theme.name);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMenuSidebarPositionEnd(): boolean {
    return this.sidebar.id === 'end';
  }

  isSettingsSidebarPositionEnd(): boolean {
    return !this.isMenuSidebarPositionEnd();
  }
}

import { Component } from '@angular/core';

import { StateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  template: `
    <span class="subheader">布局</span>
    <div class="settings-row">
      <button *ngFor="let layout of layouts"
              dyButton
              [appearance]="layout.selected ? 'outline' : 'ghost'"
              [attr.aria-label]="layout.name"
              [attr.title]="layout.name"
              (click)="layoutSelect(layout)"
              class="select-button">
        <!-- <i [attr.class]="layout.icon + ' setting-icon'"></i> -->
        <dy-icon [icon]="layout.icon"></dy-icon>
      </button>
    </div>

    <span class="subheader">侧边栏</span>
    <div class="settings-row">
      <button *ngFor="let sidebar of sidebars"
              dyButton
              [appearance]="sidebar.selected ? 'outline' : 'ghost'"
              [attr.aria-label]="sidebar.name"
              [attr.title]="sidebar.name"
              (click)="sidebarSelect(sidebar)"
              class="select-button">
        <!-- <i [attr.class]="sidebar.icon + ' setting-icon'"></i> -->
        <dy-icon [icon]="sidebar.icon"></dy-icon>
      </button>
    </div>

    <span class="subheader layout-setting-heading">布局方向</span>
    <div class="settings-row">
      <div class="switcher">
        <ngx-layout-direction-switcher></ngx-layout-direction-switcher>
      </div>
    </div>
  `,
})
export class ThemeSettingsComponent {

  layouts = [];
  sidebars = [];

  constructor(protected stateService: StateService) {
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => this.layouts = layouts);

    this.stateService.getSidebarStates()
      .subscribe((sidebars: any[]) => this.sidebars = sidebars);
  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }

  sidebarSelect(sidebar: any): boolean {
    this.sidebars = this.sidebars.map((s: any) => {
      s.selected = false;
      return s;
    });

    sidebar.selected = true;
    this.stateService.setSidebarState(sidebar);
    return false;
  }
}

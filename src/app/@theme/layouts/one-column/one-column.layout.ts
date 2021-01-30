import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <dy-layout windowMode>
      <dy-layout-header fixed>
        <ngx-header></ngx-header>
      </dy-layout-header>

      <dy-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="dy-menu"></ng-content>
      </dy-sidebar>

      <dy-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </dy-layout-column>

      <dy-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </dy-layout-footer>
    </dy-layout>
  `,
})
export class OneColumnLayoutComponent {}

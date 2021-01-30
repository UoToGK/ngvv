

import { NgModule, ModuleWithProviders } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';

import {
  DySidebarComponent,
  DySidebarFooterComponent,
  DySidebarHeaderComponent,
} from './sidebar.component';

import { DySidebarService } from './sidebar.service';

const DY_SIDEBAR_COMPONENTS = [
  DySidebarComponent,
  DySidebarFooterComponent,
  DySidebarHeaderComponent,
];

const DY_SIDEBAR_PROVIDERS = [
  DySidebarService,
];

@NgModule({
  imports: [
    DySharedModule,
  ],
  declarations: [
    ...DY_SIDEBAR_COMPONENTS,
  ],
  exports: [
    ...DY_SIDEBAR_COMPONENTS,
  ],
})
export class DySidebarModule {
  static forRoot(): ModuleWithProviders<DySidebarModule> {
    return {
      ngModule: DySidebarModule,
      providers: [
        ...DY_SIDEBAR_PROVIDERS,
      ],
    };
  }
}

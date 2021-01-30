import { ModuleWithProviders, NgModule, Injectable } from '@angular/core';

import { DyFocusTrapFactoryService } from './focus-trap';
import { DyFocusKeyManagerFactoryService } from './focus-key-manager';
import { DyActiveDescendantKeyManagerFactoryService } from './descendant-key-manager';
import { FocusMonitor } from '@angular/cdk/a11y';

@Injectable()
export class DyFocusMonitor extends FocusMonitor {}

@NgModule({})
export class DyA11yModule {
  static forRoot(): ModuleWithProviders<DyA11yModule> {
    return {
      ngModule: DyA11yModule,
      providers: [
        DyFocusTrapFactoryService,
        DyFocusKeyManagerFactoryService,
        DyActiveDescendantKeyManagerFactoryService,
        { provide: DyFocusMonitor, useClass: FocusMonitor },
      ],
    };
  }
}

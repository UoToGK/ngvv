

import { NgModule, ModuleWithProviders } from '@angular/core';

import { DySharedModule } from '../shared/shared.module';
import { DyMenuComponent, DyMenuItemComponent } from './menu.component';
import { DyMenuService, DyMenuInternalService } from './menu.service';
import { DyIconModule } from '../icon/icon.module';
import { DyBadgeModule } from '../badge/badge.module';

const dyMenuComponents = [DyMenuComponent, DyMenuItemComponent];

const DY_MENU_PROVIDERS = [DyMenuService, DyMenuInternalService];

@NgModule({
  imports: [
    DySharedModule,
    DyIconModule,
    DyBadgeModule,
  ],
  declarations: [...dyMenuComponents],
  exports: [...dyMenuComponents],
})
export class DyMenuModule {
  static forRoot(): ModuleWithProviders<DyMenuModule> {
    return {
      ngModule: DyMenuModule,
      providers: [
        ...DY_MENU_PROVIDERS,
      ],
    };
  }
}

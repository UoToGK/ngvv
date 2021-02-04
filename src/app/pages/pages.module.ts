import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { TestComponent } from './test/test.component';
import { DyAlertModule, DyMenuModule } from 'src/framework/theme/public_api';
import { DashboardModule } from './dashboard/dashboard.module';
// import { ECommerceModule } from './e-commerce/e-commerce.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DyMenuModule,
    DyAlertModule,
    DashboardModule,
    // ECommerceModule,
    MiscellaneousModule

  ],
  declarations: [
    PagesComponent,
    TestComponent
  ],
})
export class PagesModule {
}

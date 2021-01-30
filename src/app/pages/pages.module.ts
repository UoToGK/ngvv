import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { TestComponent } from './test/test.component';
import { NotFoundComponent } from './test/not-found/not-found.component';
import { DyAlertModule, DyMenuModule } from 'src/framework/theme/public_api';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DyMenuModule,
    DyAlertModule
  ],
  declarations: [
    PagesComponent,NotFoundComponent,TestComponent
  ],
})
export class PagesModule {
}

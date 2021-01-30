import {NgModule} from '@angular/core';
import {StarterRoutingModule} from './starter-routing.module';
import {NgxStarterComponent} from './starter.component';
import {DyActionsModule, DyButtonModule, DyCardModule, DyIconModule, DyLayoutModule} from 'src/framework/theme/public_api';
import {ThemeModule} from '../@theme/theme.module';

const DY_MODULES = [
  DyIconModule,
  DyLayoutModule,
  DyCardModule,
  DyButtonModule,
];

@NgModule({
  imports: [
    StarterRoutingModule,
    ...DY_MODULES,
    ThemeModule,
    DyActionsModule,
  ],
  declarations: [
    NgxStarterComponent,
    NgxStarterComponent,
  ],
})
export class StarterModule {
}

import { NgModule } from '@angular/core';
import { DyAlertModule, DyCardModule, DyIconModule, DyPopoverModule, DySearchModule } from 'src/framework/theme/public_api';

import { ThemeModule } from '../../@theme/theme.module';
import { UiFeaturesRoutingModule } from './ui-features-routing.module';
import { UiFeaturesComponent } from './ui-features.component';
import { GridComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { SearchComponent } from './search-fields/search-fields.component';

const components = [
  UiFeaturesComponent,
  GridComponent,
  IconsComponent,
  TypographyComponent,
  SearchComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    DyCardModule,
    DyPopoverModule,
    DySearchModule,
    DyIconModule,
    DyAlertModule,
    UiFeaturesRoutingModule,
  ],
  declarations: [
    ...components,
  ],
})
export class UiFeaturesModule { }

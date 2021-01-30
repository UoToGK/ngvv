import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import {
  DyActionsModule,
  DyLayoutModule,
  DyMenuModule,
  DySearchModule,
  DySidebarModule,
  DyUserModule,
  DyContextMenuModule,
  DyButtonModule,
  DySelectModule,
  DyIconModule,
  DyThemeModule,
  DyCardModule,
  DyEvaIconsModule,
} from 'src/framework/theme/public_api';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
  CallActionCardComponent,
  ToggleSettingsButtonComponent,
  LayoutDirectionSwitcherComponent,
  SwitcherComponent,
  ThemeSettingsComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  SampleLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { MATERIAL_LIGHT_THEME } from './styles/material/theme.material-light';
import { MATERIAL_DARK_THEME } from './styles/material/theme.material-dark';
import { DySecurityModule } from 'src/framework/security/public_api';

const DY_MODULES = [
  DyLayoutModule,
  DyMenuModule,
  DyUserModule,
  DyActionsModule,
  DySearchModule,
  DySidebarModule,
  DyContextMenuModule,
  DySecurityModule,
  DyButtonModule,
  DySelectModule,
  DyIconModule,
  DyEvaIconsModule,
  DyCardModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  CallActionCardComponent,
  ToggleSettingsButtonComponent,
  LayoutDirectionSwitcherComponent,
  SwitcherComponent,
  SampleLayoutComponent,
  ThemeSettingsComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, MatRippleModule, ...DY_MODULES],
  exports: [CommonModule, MatRippleModule, ...PIPES, ...COMPONENTS,...DY_MODULES],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...DyThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME, MATERIAL_LIGHT_THEME, MATERIAL_DARK_THEME ],
        ).providers,
      ],
    };
  }
}

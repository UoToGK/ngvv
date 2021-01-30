import { NgModule, ModuleWithProviders, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';

import {
  DY_BUILT_IN_JS_THEMES,
  DY_MEDIA_BREAKPOINTS,
  DyThemeOptions,
  DY_THEME_OPTIONS,
  DY_JS_THEMES,
  DY_DOCUMENT,
  DY_WINDOW,
} from './theme.options';
import { DyThemeService } from './services/theme.service';
import { DySpinnerService } from './services/spinner.service';
import { DyJSThemeOptions } from './services/js-themes/theme.options';
import { BUILT_IN_THEMES, DyJSThemesRegistry } from './services/js-themes-registry.service';
import {
  DEFAULT_MEDIA_BREAKPOINTS,
  DyMediaBreakpoint,
  DyMediaBreakpointsService,
} from './services/breakpoints.service';
import { DyLayoutDirectionService, DyLayoutDirection, DY_LAYOUT_DIRECTION } from './services/direction.service';
import { DyLayoutScrollService } from './services/scroll.service';
import { DyLayoutRulerService } from './services/ruler.service';
import { DyOverlayModule } from './components/cdk/overlay/overlay.module';
import { DyStatusService } from './services/status.service';

export function windowFactory(platformId: Object): Window | undefined {
  if (isPlatformBrowser(platformId)) {
    return window;
  }

  // Provide undefined to get the error when trying to access the window as it
  // shouldn't be used outside the browser. Those who need to provide something
  // instead of window (e.g. domino window when running in node) could override
  // DY_WINDOW token.
  return undefined;
}

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
})
export class DyThemeModule {

  // TODO: check the options (throw exception?)
  /**
   * Main Theme Module
   *
   * @param dyThemeOptions {DyThemeOptions} Main theme options
   * @param dyJSThemes {DyJSThemeOptions[]} List of JS Themes, will be merged with default themes
   * @param dyMediaBreakpoints {DyMediaBreakpoint} Available media breakpoints
   * @param layoutDirection {DyLayoutDirection} Layout direction
   *
   * @returns {ModuleWithProviders}
   */
  static forRoot(dyThemeOptions: DyThemeOptions = { name: 'default' },
                 dyJSThemes?: DyJSThemeOptions[],
                 dyMediaBreakpoints?: DyMediaBreakpoint[],
                 layoutDirection?: DyLayoutDirection): ModuleWithProviders<DyThemeModule> {

    return {
      ngModule: DyThemeModule,
      providers: [
        { provide: DY_THEME_OPTIONS, useValue: dyThemeOptions || {} },
        { provide: DY_BUILT_IN_JS_THEMES, useValue: BUILT_IN_THEMES },
        { provide: DY_JS_THEMES, useValue: dyJSThemes || [] },
        { provide: DY_MEDIA_BREAKPOINTS, useValue: dyMediaBreakpoints || DEFAULT_MEDIA_BREAKPOINTS },
        { provide: DY_DOCUMENT, useExisting: DOCUMENT },
        { provide: DY_WINDOW, useFactory: windowFactory, deps: [ PLATFORM_ID ] },
        DyJSThemesRegistry,
        DyThemeService,
        DyMediaBreakpointsService,
        DySpinnerService,
        { provide: DY_LAYOUT_DIRECTION, useValue: layoutDirection || DyLayoutDirection.LTR },
        DyLayoutDirectionService,
        DyLayoutScrollService,
        DyLayoutRulerService,
        ...DyOverlayModule.forRoot().providers,
        DyStatusService
      ],
    };
  }
}

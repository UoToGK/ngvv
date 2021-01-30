

import { InjectionToken } from '@angular/core';
import { DyMediaBreakpoint } from './services/breakpoints.service';
import { DyJSThemeOptions } from './services/js-themes/theme.options';

export interface DyThemeOptions {
  name: string;
}

export const DY_THEME_OPTIONS = new InjectionToken<DyThemeOptions>('Nebular Theme Options');
export const DY_MEDIA_BREAKPOINTS = new InjectionToken<DyMediaBreakpoint[]>('Nebular Media Breakpoints');
export const DY_BUILT_IN_JS_THEMES = new InjectionToken<DyJSThemeOptions[]>('Nebular Built-in JS Themes');
export const DY_JS_THEMES = new InjectionToken<DyJSThemeOptions[]>('Nebular JS Themes');

/**
 * We're providing browser apis with tokens to improve testing capabilities.
 * */
export const DY_WINDOW = new InjectionToken<Window>('Window');
export const DY_DOCUMENT = new InjectionToken<Document>('Document');

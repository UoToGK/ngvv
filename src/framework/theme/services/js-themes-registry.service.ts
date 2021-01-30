

import { Inject, Injectable } from '@angular/core';


import { DyJSThemeOptions } from './js-themes/theme.options';
import { DEFAULT_THEME } from './js-themes/default.theme';
import { COSMIC_THEME } from './js-themes/cosmic.theme';
import { CORPORATE_THEME } from './js-themes/corporate.theme';
import { DARK_THEME } from './js-themes/dark.theme';
import { DY_BUILT_IN_JS_THEMES, DY_JS_THEMES } from '../theme.options';

export const BUILT_IN_THEMES: DyJSThemeOptions[] = [
  DEFAULT_THEME,
  COSMIC_THEME,
  CORPORATE_THEME,
  DARK_THEME,
];

/**
 * Js Themes registry - provides access to the JS themes' variables.
 * Usually shouldn't be used directly, but through the DyThemeService class methods (getJsTheme).
 */
@Injectable()
export class DyJSThemesRegistry {

  private themes: any = {};

  constructor(@Inject(DY_BUILT_IN_JS_THEMES) builtInThemes: DyJSThemeOptions[],
              @Inject(DY_JS_THEMES) newThemes: DyJSThemeOptions[] = []) {

    const themes = this.combineByNames(newThemes, builtInThemes);

    themes.forEach((theme: any) => {
      this.register(theme, theme.name, theme.base);
    });
  }

  /**
   * Registers a new JS theme
   * @param config any
   * @param themeName string
   * @param baseTheme string
   */
  register(config: any, themeName: string, baseTheme: string) {
    const base = this.has(baseTheme) ? this.get(baseTheme) : {};
    this.themes[themeName] = this.mergeDeep({}, base, config);
  }

  /**
   * Checks whether the theme is registered
   * @param themeName
   * @returns boolean
   */
  has(themeName: string): boolean {
    return !!this.themes[themeName];
  }

  /**
   * Return a theme
   * @param themeName
   * @returns DyJSThemeOptions
   */
  get(themeName: string): DyJSThemeOptions {
    if (!this.themes[themeName]) {
      throw Error(`DyThemeConfig: no theme '${themeName}' found registered.`);
    }
    return JSON.parse(JSON.stringify(this.themes[themeName]));
  }

  private combineByNames(newThemes: DyJSThemeOptions[], oldThemes: DyJSThemeOptions[]): DyJSThemeOptions[] {
    if (newThemes) {
      const mergedThemes: DyJSThemeOptions[] = [];
      newThemes.forEach((theme: DyJSThemeOptions) => {
        const sameOld: DyJSThemeOptions = oldThemes.find((tm: DyJSThemeOptions) => tm.name === theme.name)
          || <DyJSThemeOptions>{};

        const mergedTheme = this.mergeDeep({}, sameOld, theme);
        mergedThemes.push(mergedTheme);
      });

      oldThemes.forEach((theme: DyJSThemeOptions) => {
        if (!mergedThemes.find((tm: DyJSThemeOptions) => tm.name === theme.name)) {
          mergedThemes.push(theme);
        }
      });
      return mergedThemes;
    }
    return oldThemes;
  }


  private isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  // TODO: move to helpers
  private mergeDeep(target, ...sources) {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.mergeDeep(target, ...sources);
  }
}

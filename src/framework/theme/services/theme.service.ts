

import { Inject, Injectable } from '@angular/core';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, filter, pairwise, distinctUntilChanged, startWith, share } from 'rxjs/operators';

import { DY_THEME_OPTIONS } from '../theme.options';
import { DyJSThemeOptions } from './js-themes/theme.options';
import { DyJSThemesRegistry } from './js-themes-registry.service';
import { DyMediaBreakpointsService, DyMediaBreakpoint } from './breakpoints.service';

/**
 * Main Nebular service. Includes various helper methods.
 */
@Injectable()
export class DyThemeService {

  // TODO: behavioral subject here?
  currentTheme: string;
  private themeChanges$ = new ReplaySubject(1);
  private appendLayoutClass$ = new Subject();
  private removeLayoutClass$ = new Subject();
  private changeWindowWidth$ = new ReplaySubject<number>(2);

  constructor(@Inject(DY_THEME_OPTIONS) protected options: any,
              private breakpointService: DyMediaBreakpointsService,
              private jsThemesRegistry: DyJSThemesRegistry) {
    if (options && options.name) {
      this.changeTheme(options.name);
    }
  }

  /**
   * Change current application theme
   * @param {string} name
   */
  changeTheme(name: string): void {
    this.themeChanges$.next({ name, previous: this.currentTheme });
    this.currentTheme = name;
  }

  changeWindowWidth(width: number): void {
    this.changeWindowWidth$.next(width);
  }

  /**
   * Returns a theme object with variables (color/paddings/etc) on a theme change.
   * Once subscribed - returns current theme.
   *
   * @returns {Observable<DyJSThemeOptions>}
   */
  getJsTheme(): Observable<DyJSThemeOptions> {
    return this.onThemeChange().pipe(
      map((theme: any) => {
        return this.jsThemesRegistry.get(theme.name);
      }),
    );
  }

  /**
   * Triggers media query breakpoint change
   * Returns a pair where the first item is previous media breakpoint and the second item is current breakpoit.
   * ```ts
   *  [{ name: 'xs', width: 0 }, { name: 'md', width: 768 }] // change from `xs` to `md`
   * ```
   * @returns {Observable<[DyMediaBreakpoint, DyMediaBreakpoint]>}
   */
  onMediaQueryChange(): Observable<DyMediaBreakpoint[]> {
    return this.changeWindowWidth$
      .pipe(
        startWith(undefined),
        pairwise(),
        map(([prevWidth, width]: [number, number]) => {
          return [
            this.breakpointService.getByWidth(prevWidth),
            this.breakpointService.getByWidth(width),
          ]
        }),
        filter(([prevPoint, point]: [DyMediaBreakpoint, DyMediaBreakpoint]) => {
          return prevPoint.name !== point.name;
        }),
        distinctUntilChanged(null, params => params[0].name + params[1].name),
        share(),
      );
  }

  /**
   * Triggered when current theme is changed
   * @returns {Observable<any>}
   */
  onThemeChange(): Observable<any> {
    return this.themeChanges$.pipe(share());
  }

  /**
   * Append a class to dy-layout
   * @param {string} className
   */
  appendLayoutClass(className: string) {
    this.appendLayoutClass$.next(className);
  }

  /**
   * Triggered when a new class is added to dy-layout through `appendLayoutClass` method
   * @returns {Observable<any>}
   */
  onAppendLayoutClass(): Observable<any> {
    return this.appendLayoutClass$.pipe(share());
  }

  /**
   * Removes a class from dy-layout
   * @param {string} className
   */
  removeLayoutClass(className: string) {
    this.removeLayoutClass$.next(className);
  }

  /**
   * Triggered when a class is removed from dy-layout through `removeLayoutClass` method
   * @returns {Observable<any>}
   */
  onRemoveLayoutClass(): Observable<any> {
    return this.removeLayoutClass$.pipe(share());
  }
}

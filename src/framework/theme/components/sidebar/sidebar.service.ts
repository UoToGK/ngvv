

import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { share, refCount } from 'rxjs/operators';
import { DySidebarResponsiveState, DySidebarState } from './sidebar.component';

export const getSidebarState$ = new Subject<{ tag: string, observer: Observer<DySidebarState> }>();
export const getSidebarResponsiveState$ = new Subject<{ tag: string, observer: Observer<DySidebarResponsiveState> }>();

/**
 * Sidebar service.
 *
 * Root module service to control the sidebar from any part of the app.
 *
 * Allows you to change sidebar state dynamically from any part of the app:
 * @stacked-example(Sidebar State, sidebar/sidebar-toggle.component)
 */
@Injectable()
export class DySidebarService {

  private toggle$ = new Subject<{ compact: boolean, tag: string }>();
  private expand$ = new Subject<{ tag: string }>();
  private collapse$ = new Subject<{ tag: string }>();
  private compact$ = new Subject<{ tag: string }>();

  /**
   * Subscribe to toggle events
   *
   * @returns Observable<{ compact: boolean, tag: string }>
   */
  onToggle(): Observable<{ compact: boolean, tag: string }> {
    return this.toggle$.pipe(share());
  }

  /**
   * Subscribe to expand events
   * @returns Observable<{ tag: string }>
   */
  onExpand(): Observable<{ tag: string }> {
    return this.expand$.pipe(share());
  }

  /**
   * Subscribe to collapse evens
   * @returns Observable<{ tag: string }>
   */
  onCollapse(): Observable<{ tag: string }> {
    return this.collapse$.pipe(share());
  }

  /**
   * Subscribe to compact evens
   * @returns Observable<{ tag: string }>
   */
  onCompact(): Observable<{ tag: string }> {
    return this.compact$.pipe(share());
  }

  /**
   * Toggle a sidebar
   * @param {boolean} compact
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  toggle(compact = false, tag?: string) {
    this.toggle$.next({ compact, tag });
  }

  /**
   * Expands a sidebar
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  expand(tag?: string) {
    this.expand$.next({ tag });
  }

  /**
   * Collapses a sidebar
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  collapse(tag?: string) {
    this.collapse$.next({ tag });
  }

  /**
   * Makes sidebar compact
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  compact(tag?: string) {
    this.compact$.next({ tag });
  }

  /**
   * Returns sidebar state
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar state you need
   */
  getSidebarState(tag?: string): Observable<DySidebarState> {
    const observer = new Subject<DySidebarState>();
    getSidebarState$.next({ observer, tag });
    return observer.pipe(refCount());
  }

  /**
   * Returns sidebar responsive state
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar responsive state you need
   */
  getSidebarResponsiveState(tag?: string): Observable<DySidebarResponsiveState> {
    const observer = new Subject<DySidebarResponsiveState>();
    getSidebarResponsiveState$.next({ observer, tag });
    return observer.pipe(refCount());
  }
}

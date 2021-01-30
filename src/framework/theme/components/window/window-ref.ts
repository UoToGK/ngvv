import { ComponentRef } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DyWindowComponent } from './window.component';
import { DyWindowConfig, DyWindowState, DyWindowStateChange } from './window.options';

/**
 * The `DyWindowRef` helps to manipulate window after it was created.
 * The window can be dismissed by using `close` method of the windowRef.
 * You can access rendered component as `componentRef` property of the windowRef.
 */
export class DyWindowRef {
  componentRef: ComponentRef<DyWindowComponent>;

  protected prevStateValue: DyWindowState;
  protected stateValue: DyWindowState;
  /**
   * Current window state.
   */
  get state() {
    return this.stateValue;
  }
  set state(newState: DyWindowState) {
    if (newState && this.stateValue !== newState) {
      this.prevStateValue = this.state;
      this.stateValue = newState;
      this.stateChange$.next({ oldState: this.prevStateValue, newState });
    }
  }

  protected stateChange$ = new ReplaySubject<DyWindowStateChange>(1);
  /**
   * Emits when window state change.
   */
  get stateChange(): Observable<DyWindowStateChange> {
    return this.stateChange$.asObservable();
  }

  protected _closed = false;
  protected closed$ = new Subject();
  /**
   * Emits when window was closed.
   */
  get onClose() {
    return this.closed$.asObservable();
  }

  constructor(public config: DyWindowConfig) {
    this.state = config.initialState;
  }

  /**
   * Minimize window.
   */
  minimize() {
    this.state = DyWindowState.MINIMIZED;
  }

  /**
   * Maximize window.
   */
  maximize() {
    this.state = DyWindowState.MAXIMIZED;
  }

  /**
   * Set window on top.
   */
  fullScreen() {
    this.state = DyWindowState.FULL_SCREEN;
  }

  toPreviousState() {
    this.state = this.prevStateValue;
  }

  /**
   * Closes window.
   * */
  close() {
    if (this._closed) {
      return;
    }

    this._closed = true;
    this.componentRef.destroy();
    this.stateChange$.complete();
    this.closed$.next();
    this.closed$.complete();
  }
}

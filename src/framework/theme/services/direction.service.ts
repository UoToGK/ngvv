import { InjectionToken, Optional, Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';

/**
 * Layout direction.
 * */
export enum DyLayoutDirection {
  LTR = 'ltr',
  RTL = 'rtl',
};

/**
 * Layout direction setting injection token.
 * */
export const DY_LAYOUT_DIRECTION = new InjectionToken<DyLayoutDirection>('Layout direction');

/**
 * Layout Direction Service.
 * Allows to set or get layout direction and listen to its changes
 */
@Injectable()
export class DyLayoutDirectionService {
  private $directionChange = new ReplaySubject(1);

  constructor(
    @Optional() @Inject(DY_LAYOUT_DIRECTION) private direction = DyLayoutDirection.LTR,
  ) {
    this.setDirection(direction);
  }

  /**
   * Returns true if layout direction set to left to right.
   * @returns boolean.
   * */
  public isLtr(): boolean {
    return this.direction === DyLayoutDirection.LTR;
  }

  /**
   * Returns true if layout direction set to right to left.
   * @returns boolean.
   * */
  public isRtl(): boolean {
    return this.direction === DyLayoutDirection.RTL;
  }

  /**
   * Returns current layout direction.
   * @returns DyLayoutDirection.
   * */
  getDirection(): DyLayoutDirection {
    return this.direction;
  }

  /**
   * Sets layout direction
   * @param {DyLayoutDirection} direction
   */
  setDirection(direction: DyLayoutDirection) {
    this.direction = direction;
    this.$directionChange.next(direction);
  }

  /**
   * Triggered when direction was changed.
   * @returns Observable<DyLayoutDirection>.
   */
  onDirectionChange(): Observable<DyLayoutDirection> {
    return this.$directionChange.pipe(share<DyLayoutDirection>());
  }
}

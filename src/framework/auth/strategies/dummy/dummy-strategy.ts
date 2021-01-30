import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { delay } from 'rxjs/operators';

import { DyAuthStrategy } from '../auth-strategy';
import { DyAuthResult } from '../../services/auth-result';
import { DyDummyAuthStrategyOptions, dummyStrategyOptions } from './dummy-strategy-options';
import { DyAuthStrategyClass } from '../../auth.options';


/**
 * Dummy auth strategy. Could be useful for auth setup when backend is not available yet.
 *
 *
 * Strategy settings.
 *
 * ```ts
 * export class DyDummyAuthStrategyOptions extends DyAuthStrategyOptions {
 *   name = 'dummy';
 *   token = {
 *     class: DyAuthSimpleToken,
 *   };
 *   delay? = 1000;
 *   alwaysFail? = false;
 * }
 * ```
 */
@Injectable()
export class DyDummyAuthStrategy extends DyAuthStrategy {

  protected defaultOptions: DyDummyAuthStrategyOptions = dummyStrategyOptions;

  static setup(options: DyDummyAuthStrategyOptions): [DyAuthStrategyClass, DyDummyAuthStrategyOptions] {
    return [DyDummyAuthStrategy, options];
  }

  authenticate(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  register(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  requestPassword(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  resetPassword(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  logout(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  refreshToken(data?: any): Observable<DyAuthResult> {
    return observableOf(this.createDummyResult(data))
      .pipe(
        delay(this.getOption('delay')),
      );
  }

  protected createDummyResult(data?: any): DyAuthResult {

    if (this.getOption('alwaysFail')) {
      return new DyAuthResult(
        false,
        this.createFailResponse(data),
        null,
        ['Something went wrong.'],
      );
    }

    try {
      const token = this.createToken('test token', true);
      return new DyAuthResult(
        true,
        this.createSuccessResponse(data),
        '/',
        [],
        ['Successfully logged in.'],
        token,
      );
    } catch (err) {
      return new DyAuthResult(
        false,
        this.createFailResponse(data),
        null,
        [err.message],
      );
    }


  }
}

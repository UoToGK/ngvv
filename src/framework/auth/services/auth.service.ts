
import { Inject, Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { DyAuthStrategy } from '../strategies/auth-strategy';
import { DY_AUTH_STRATEGIES } from '../auth.options';
import { DyAuthResult } from './auth-result';
import { DyTokenService } from './token/token.service';
import { DyAuthToken } from './token/token';

/**
 * Common authentication service.
 * Should be used to as an interlayer between UI Components and Auth Strategy.
 */
@Injectable()
export class DyAuthService {

  constructor(protected tokenService: DyTokenService,
              @Inject(DY_AUTH_STRATEGIES) protected strategies) {
  }

  /**
   * Retrieves current authenticated token stored
   * @returns {Observable<any>}
   */
  getToken(): Observable<DyAuthToken> {
    return this.tokenService.get();
  }

  /**
   * Returns true if auth token is present in the token storage
   * @returns {Observable<boolean>}
   */
  isAuthenticated(): Observable<boolean> {
    return this.getToken()
      .pipe(map((token: DyAuthToken) => token.isValid()));
  }

  /**
   * Returns true if valid auth token is present in the token storage.
   * If not, calls the strategy refreshToken, and returns isAuthenticated() if success, false otherwise
   * @returns {Observable<boolean>}
   */
  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.getToken()
      .pipe(
        switchMap(token => {
        if (token.getValue() && !token.isValid()) {
          return this.refreshToken(token.getOwnerStrategyName(), token)
            .pipe(
              switchMap(res => {
                if (res.isSuccess()) {
                  return this.isAuthenticated();
                } else {
                  return observableOf(false);
                }
              }),
            )
        } else {
          return observableOf(token.isValid());
        }
    }));
  }

  /**
   * Returns tokens stream
   * @returns {Observable<DyAuthSimpleToken>}
   */
  onTokenChange(): Observable<DyAuthToken> {
    return this.tokenService.tokenChange();
  }

  /**
   * Returns authentication status stream
   * @returns {Observable<boolean>}
   */
  onAuthenticationChange(): Observable<boolean> {
    return this.onTokenChange()
      .pipe(map((token: DyAuthToken) => token.isValid()));
  }

  /**
   * Authenticates with the selected strategy
   * Stores received token in the token storage
   *
   * Example:
   * authenticate('email', {email: 'email@example.com', password: 'test'})
   *
   * @param strategyName
   * @param data
   * @returns {Observable<DyAuthResult>}
   */
  authenticate(strategyName: string, data?: any): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).authenticate(data)
      .pipe(
        switchMap((result: DyAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  /**
   * Registers with the selected strategy
   * Stores received token in the token storage
   *
   * Example:
   * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
   *
   * @param strategyName
   * @param data
   * @returns {Observable<DyAuthResult>}
   */
  register(strategyName: string, data?: any): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).register(data)
      .pipe(
        switchMap((result: DyAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  /**
   * Sign outs with the selected strategy
   * Removes token from the token storage
   *
   * Example:
   * logout('email')
   *
   * @param strategyName
   * @returns {Observable<DyAuthResult>}
   */
  logout(strategyName: string): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).logout()
      .pipe(
        switchMap((result: DyAuthResult) => {
          if (result.isSuccess()) {
            this.tokenService.clear()
              .pipe(map(() => result));
          }
          return observableOf(result);
        }),
      );
  }

  /**
   * Sends forgot password request to the selected strategy
   *
   * Example:
   * requestPassword('email', {email: 'email@example.com'})
   *
   * @param strategyName
   * @param data
   * @returns {Observable<DyAuthResult>}
   */
  requestPassword(strategyName: string, data?: any): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).requestPassword(data);
  }

  /**
   * Tries to reset password with the selected strategy
   *
   * Example:
   * resetPassword('email', {newPassword: 'test'})
   *
   * @param strategyName
   * @param data
   * @returns {Observable<DyAuthResult>}
   */
  resetPassword(strategyName: string, data?: any): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).resetPassword(data);
  }

  /**
   * Sends a refresh token request
   * Stores received token in the token storage
   *
   * Example:
   * refreshToken('email', {token: token})
   *
   * @param {string} strategyName
   * @param data
   * @returns {Observable<DyAuthResult>}
   */
  refreshToken(strategyName: string, data?: any): Observable<DyAuthResult> {
    return this.getStrategy(strategyName).refreshToken(data)
      .pipe(
        switchMap((result: DyAuthResult) => {
          return this.processResultToken(result);
        }),
      );
  }

  /**
   * Get registered strategy by name
   *
   * Example:
   * getStrategy('email')
   *
   * @param {string} provider
   * @returns {DyAbstractAuthProvider}
   */
  protected getStrategy(strategyName: string): DyAuthStrategy {
    const found = this.strategies.find((strategy: DyAuthStrategy) => strategy.getName() === strategyName);

    if (!found) {
      throw new TypeError(`There is no Auth Strategy registered under '${strategyName}' name`);
    }

    return found;
  }

  private processResultToken(result: DyAuthResult) {
    if (result.isSuccess() && result.getToken()) {
      return this.tokenService.set(result.getToken())
        .pipe(
          map((token: DyAuthToken) => {
            return result;
          }),
        );
    }

    return observableOf(result);
  }
}

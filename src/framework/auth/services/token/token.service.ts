import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { filter, share } from 'rxjs/operators';

import { DyTokenStorage } from './token-storage';
import { DyAuthToken } from './token';

/**
 * Service that allows you to manage authentication token - get, set, clear and also listen to token changes over time.
 */
@Injectable()
export class DyTokenService {

  protected token$: BehaviorSubject<DyAuthToken> = new BehaviorSubject(null);

  constructor(protected tokenStorage: DyTokenStorage) {
    this.publishStoredToken();
  }

  /**
   * Publishes token when it changes.
   * @returns {Observable<DyAuthToken>}
   */
  tokenChange(): Observable<DyAuthToken> {
    return this.token$
      .pipe(
        filter(value => !!value),
        share(),
      );
  }

  /**
   * Sets a token into the storage. This method is used by the DyAuthService automatically.
   *
   * @param {DyAuthToken} token
   * @returns {Observable<any>}
   */
  set(token: DyAuthToken): Observable<null> {
    this.tokenStorage.set(token);
    this.publishStoredToken();
    return observableOf(null);
  }

  /**
   * Returns observable of current token
   * @returns {Observable<DyAuthToken>}
   */
  get(): Observable<DyAuthToken> {
    const token = this.tokenStorage.get();
    return observableOf(token);
  }

  /**
   * Removes the token and published token value
   *
   * @returns {Observable<any>}
   */
  clear(): Observable<null> {
    this.tokenStorage.clear();
    this.publishStoredToken();
    return observableOf(null);
  }

  protected publishStoredToken() {
    this.token$.next(this.tokenStorage.get());
  }
}

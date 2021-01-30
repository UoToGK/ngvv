import { Injectable } from '@angular/core';

import { DyAuthToken } from './token';
import { DyAuthTokenParceler } from './token-parceler';

export abstract class DyTokenStorage {

  abstract get(): DyAuthToken;
  abstract set(token: DyAuthToken);
  abstract clear();
}

/**
 * Service that uses browser localStorage as a storage.
 *
 * The token storage is provided into auth module the following way:
 * ```ts
 * { provide: DyTokenStorage, useClass: DyTokenLocalStorage },
 * ```
 *
 * If you need to change the storage behaviour or provide your own - just extend your class from basic `DyTokenStorage`
 * or `DyTokenLocalStorage` and provide in your `app.module`:
 * ```ts
 * { provide: DyTokenStorage, useClass: DyTokenCustomStorage },
 * ```
 *
 */
@Injectable()
export class DyTokenLocalStorage extends DyTokenStorage {

  protected key = 'auth_app_token';

  constructor(private parceler: DyAuthTokenParceler) {
    super();
  }

  /**
   * Returns token from localStorage
   * @returns {DyAuthToken}
   */
  get(): DyAuthToken {
    const raw = localStorage.getItem(this.key);
    return this.parceler.unwrap(raw);
  }

  /**
   * Sets token to localStorage
   * @param {DyAuthToken} token
   */
  set(token: DyAuthToken) {
    const raw = this.parceler.wrap(token);
    localStorage.setItem(this.key, raw);
  }

  /**
   * Clears token from localStorage
   */
  clear() {
    localStorage.removeItem(this.key);
  }
}

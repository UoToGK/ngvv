import { Inject, Injectable, InjectionToken } from '@angular/core';

import { dyAuthCreateToken, DyAuthToken, DyAuthTokenClass } from './token';
import { DY_AUTH_TOKENS } from '../../auth.options';

export interface DyTokenPack {
  name: string,
  ownerStrategyName: string,
  createdAt: Number,
  value: string,
}

export const DY_AUTH_FALLBACK_TOKEN = new InjectionToken<DyAuthTokenClass>('Nebular Auth Options');

/**
 * Creates a token parcel which could be stored/restored
 */
@Injectable()
export class DyAuthTokenParceler {

  constructor(@Inject(DY_AUTH_FALLBACK_TOKEN) private fallbackClass: DyAuthTokenClass,
              @Inject(DY_AUTH_TOKENS) private tokenClasses: DyAuthTokenClass[]) {
  }

  wrap(token: DyAuthToken): string {
    return JSON.stringify({
      name: token.getName(),
      ownerStrategyName: token.getOwnerStrategyName(),
      createdAt: token.getCreatedAt().getTime(),
      value: token.toString(),
    });
  }

  unwrap(value: string): DyAuthToken {
    let tokenClass: DyAuthTokenClass = this.fallbackClass;
    let tokenValue = '';
    let tokenOwnerStrategyName = '';
    let tokenCreatedAt: Date = null;

    const tokenPack: DyTokenPack = this.parseTokenPack(value);
    if (tokenPack) {
      tokenClass = this.getClassByName(tokenPack.name) || this.fallbackClass;
      tokenValue = tokenPack.value;
      tokenOwnerStrategyName = tokenPack.ownerStrategyName;
      tokenCreatedAt = new Date(Number(tokenPack.createdAt));
    }

    return dyAuthCreateToken(tokenClass, tokenValue, tokenOwnerStrategyName, tokenCreatedAt);

  }

  // TODO: this could be moved to a separate token registry
  protected getClassByName(name): DyAuthTokenClass {
    return this.tokenClasses.find((tokenClass: DyAuthTokenClass) => tokenClass.NAME === name);
  }

  protected parseTokenPack(value): DyTokenPack {
    try {
      return JSON.parse(value);
    } catch (e) { }
    return null;
  }
}

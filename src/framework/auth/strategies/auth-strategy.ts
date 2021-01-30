import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DyAuthResult } from '../services/auth-result';
import { DyAuthStrategyOptions } from './auth-strategy-options';
import { deepExtend, getDeepFromObject } from '../helpers';
import {
  DyAuthToken,
  dyAuthCreateToken,
  DyAuthIllegalTokenError,
} from '../services/token/token';

export abstract class DyAuthStrategy {

  protected defaultOptions: DyAuthStrategyOptions;
  protected options: DyAuthStrategyOptions;

  // we should keep this any and validation should be done in `register` method instead
  // otherwise it won't be possible to pass an empty object
  setOptions(options: any): void {
    this.options = deepExtend({}, this.defaultOptions, options);
  }

  getOption(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  createToken<T extends DyAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    const token =  dyAuthCreateToken<T>(this.getOption('token.class'), value, this.getName());
    // At this point, dyAuthCreateToken failed with DyAuthIllegalTokenError which MUST be intercepted by strategies
    // Or token is created. It MAY be created even if backend did not return any token, in this case it is !Valid
    if (failWhenInvalidToken && !token.isValid()) {
      // If we require a valid token (i.e. isValid), then we MUST throw DyAuthIllegalTokenError so that the strategies
      // intercept it
      throw new DyAuthIllegalTokenError('Token is empty or invalid.');
    }
    return token;
  }

  getName(): string {
    return this.getOption('name');
  }

  abstract authenticate(data?: any): Observable<DyAuthResult>;

  abstract register(data?: any): Observable<DyAuthResult>;

  abstract requestPassword(data?: any): Observable<DyAuthResult>;

  abstract resetPassword(data?: any): Observable<DyAuthResult>;

  abstract logout(): Observable<DyAuthResult>;

  abstract refreshToken(data?: any): Observable<DyAuthResult>;

  protected createFailResponse(data?: any): HttpResponse<Object> {
    return new HttpResponse<Object>({ body: {}, status: 401 });
  }

  protected createSuccessResponse(data?: any): HttpResponse<Object> {
    return new HttpResponse<Object>({ body: {}, status: 200 });
  }

  protected getActionEndpoint(action: string): string {
    const actionEndpoint: string = this.getOption(`${action}.endpoint`);
    const baseEndpoint: string = this.getOption('baseEndpoint');
    return actionEndpoint ? baseEndpoint + actionEndpoint : '';
  }
}

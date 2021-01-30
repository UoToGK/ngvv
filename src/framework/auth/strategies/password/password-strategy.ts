
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { DyAuthResult } from '../../services/auth-result';
import { DyAuthStrategy } from '../auth-strategy';
import { DyAuthStrategyClass } from '../../auth.options';
import { DyPasswordAuthStrategyOptions, passwordStrategyOptions } from './password-strategy-options';
import { DyAuthIllegalTokenError } from '../../services/token/token';

/**
 * The most common authentication provider for email/password strategy.
 *
 * Strategy settings. Note, there is no need to copy over the whole object to change the settings you need.
 * Also, this.getOption call won't work outside of the default options declaration
 * (which is inside of the `DyPasswordAuthStrategy` class), so you have to replace it with a custom helper function
 * if you need it.
 *
 * ```ts
 *export class DyPasswordAuthStrategyOptions extends DyAuthStrategyOptions {
 *  name: string;
 *  baseEndpoint? = '/api/auth/';
 *  login?: boolean | DyPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'login',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Login/Email combination is not correct, please try again.'],
 *    defaultMessages: ['You have been successfully logged in.'],
 *  };
 *  register?: boolean | DyPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'register',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully registered.'],
 *  };
 *  requestPass?: boolean | DyPasswordStrategyModule = {
 *    endpoint: 'request-pass',
 *    method: 'post',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Reset password instructions have been sent to your email.'],
 *  };
 *  resetPass?: boolean | DyPasswordStrategyReset = {
 *    endpoint: 'reset-pass',
 *    method: 'put',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    resetPasswordTokenKey: 'reset_password_token',
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your password has been successfully changed.'],
 *  };
 *  logout?: boolean | DyPasswordStrategyReset = {
 *    alwaysFail: false,
 *    endpoint: 'logout',
 *    method: 'delete',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully logged out.'],
 *  };
 *  refreshToken?: boolean | DyPasswordStrategyModule = {
 *    endpoint: 'refresh-token',
 *    method: 'post',
 *    requireValidToken: true,
 *    redirect: {
 *      success: null,
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your token has been successfully refreshed.'],
 *  };
 *  token?: DyPasswordStrategyToken = {
 *    class: DyAuthSimpleToken,
 *    key: 'data.token',
 *    getter: (module: string, res: HttpResponse<Object>, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.token.key,
 *    ),
 *  };
 *  errors?: DyPasswordStrategyMessage = {
 *    key: 'data.errors',
 *    getter: (module: string, res: HttpErrorResponse, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.error,
 *      options.errors.key,
 *      options[module].defaultErrors,
 *    ),
 *  };
 *  messages?: DyPasswordStrategyMessage = {
 *    key: 'data.messages',
 *    getter: (module: string, res: HttpResponse<Object>, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.messages.key,
 *      options[module].defaultMessages,
 *    ),
 *  };
 *  validation?: {
 *    password?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *    email?: {
 *      required?: boolean;
 *      regexp?: string | null;
 *    };
 *    fullName?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *  };
 *}
 * ```
 */
@Injectable()
export class DyPasswordAuthStrategy extends DyAuthStrategy {

  protected defaultOptions: DyPasswordAuthStrategyOptions = passwordStrategyOptions;

  static setup(options: DyPasswordAuthStrategyOptions): [DyAuthStrategyClass, DyPasswordAuthStrategyOptions] {
    return [DyPasswordAuthStrategy, options];
  }

  constructor(protected http: HttpClient, private route: ActivatedRoute) {
    super();
  }

  authenticate(data?: any): Observable<DyAuthResult> {
    const module = 'login';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse(data);
          }
          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options),
            this.createToken(this.getOption('token.getter')(module, res, this.options), requireValidToken));
        }),
        catchError((res) => {
          return this.handleResponseError(res, module);
        }),
      );
  }

  register(data?: any): Observable<DyAuthResult> {
    const module = 'register';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse(data);
          }

          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options),
            this.createToken(this.getOption('token.getter')('login', res, this.options), requireValidToken));
        }),
        catchError((res) => {
          return this.handleResponseError(res, module);
        }),
      );
  }

  requestPassword(data?: any): Observable<DyAuthResult> {
    const module = 'requestPass';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options));
        }),
        catchError((res) => {
        return this.handleResponseError(res, module);
        }),
      );
  }

  resetPassword(data: any = {}): Observable<DyAuthResult> {

    const module = 'resetPass';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);
    const tokenKey = this.getOption(`${module}.resetPasswordTokenKey`);
    data[tokenKey] = this.route.snapshot.queryParams[tokenKey];
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options));
        }),
        catchError((res) => {
          return this.handleResponseError(res, module);
        }),
      );
  }

  logout(): Observable<DyAuthResult> {

    const module = 'logout';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);

    return observableOf({})
      .pipe(
        switchMap((res: any) => {
          if (!url) {
            return observableOf(res);
          }
          return this.http.request(method, url, {observe: 'response'});
        }),
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options));
        }),
        catchError((res) => {
          return this.handleResponseError(res, module);
        }),
      );
  }

  refreshToken(data?: any): Observable<DyAuthResult> {

    const module = 'refreshToken';
    const method = this.getOption(`${module}.method`);
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getOption(`${module}.alwaysFail`)) {
            throw this.createFailResponse(data);
          }

          return res;
        }),
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('messages.getter')(module, res, this.options),
            this.createToken(this.getOption('token.getter')(module, res, this.options), requireValidToken));
        }),
        catchError((res) => {
          return this.handleResponseError(res, module);
        }),
      );
  }

  protected handleResponseError(res: any, module: string): Observable<DyAuthResult> {
    let errors = [];
    if (res instanceof HttpErrorResponse) {
      errors = this.getOption('errors.getter')(module, res, this.options);
    } else if (res instanceof DyAuthIllegalTokenError) {
      errors.push(res.message)
    } else {
      errors.push('Something went wrong.');
    }
    return observableOf(
      new DyAuthResult(
        false,
        res,
        this.getOption(`${module}.redirect.failure`),
        errors,
      ));
  }

}

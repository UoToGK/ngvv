
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { DyAuthStrategy } from '../auth-strategy';
import { DyAuthIllegalTokenError, DyAuthRefreshableToken, DyAuthToken } from '../../services/token/token';
import { DyAuthResult } from '../../services/auth-result';
import {
  DyOAuth2AuthStrategyOptions,
  DyOAuth2ResponseType,
  auth2StrategyOptions,
  DyOAuth2GrantType, DyOAuth2ClientAuthMethod,
} from './oauth2-strategy.options';
import { DyAuthStrategyClass } from '../../auth.options';
import { DY_WINDOW } from 'src/framework/theme/public_api';


/**
 * OAuth2 authentication strategy.
 *
 * Strategy settings:
 *
 * ```ts
 * export enum DyOAuth2ResponseType {
 *   CODE = 'code',
 *   TOKEN = 'token',
 * }
 *
 * export enum DyOAuth2GrantType {
 *   AUTHORIZATION_CODE = 'authorization_code',
 *   PASSWORD = 'password',
 *   REFRESH_TOKEN = 'refresh_token',
 * }
 *
 * export class DyOAuth2AuthStrategyOptions {
 *   name: string;
 *   baseEndpoint?: string = '';
 *   clientId: string = '';
 *   clientSecret: string = '';
 *   clientAuthMethod: string = DyOAuth2ClientAuthMethod.NONE;
 *   redirect?: { success?: string; failure?: string } = {
 *     success: '/',
 *     failure: null,
 *   };
 *   defaultErrors?: any[] = ['Something went wrong, please try again.'];
 *   defaultMessages?: any[] = ['You have been successfully authenticated.'];
 *   authorize?: {
 *     endpoint?: string;
 *     redirectUri?: string;
 *     responseType?: string;
 *     requireValidToken: true,
 *     scope?: string;
 *     state?: string;
 *     params?: { [key: string]: string };
 *   } = {
 *     endpoint: 'authorize',
 *     responseType: DyOAuth2ResponseType.CODE,
 *   };
 *   token?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     requireValidToken: true,
 *     redirectUri?: string;
 *     scope?: string;
 *     class: DyAuthTokenClass,
 *   } = {
 *     endpoint: 'token',
 *     grantType: DyOAuth2GrantType.AUTHORIZATION_CODE,
 *     class: DyAuthOAuth2Token,
 *   };
 *   refresh?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     scope?: string;
 *     requireValidToken: true,
 *   } = {
 *     endpoint: 'token',
 *     grantType: DyOAuth2GrantType.REFRESH_TOKEN,
 *   };
 * }
 * ```
 *
 */
@Injectable()
export class DyOAuth2AuthStrategy extends DyAuthStrategy {

  static setup(options: DyOAuth2AuthStrategyOptions): [DyAuthStrategyClass, DyOAuth2AuthStrategyOptions] {
    return [DyOAuth2AuthStrategy, options];
  }

  get responseType() {
    return this.getOption('authorize.responseType');
  }

  get clientAuthMethod() {
    return this.getOption('clientAuthMethod');
  }

  protected redirectResultHandlers: { [key: string]: Function } = {
    [DyOAuth2ResponseType.CODE]: () => {
      return observableOf(this.route.snapshot.queryParams).pipe(
        switchMap((params: any) => {
          if (params.code) {
            return this.requestToken(params.code)
          }

          return observableOf(
            new DyAuthResult(
              false,
              params,
              this.getOption('redirect.failure'),
              this.getOption('defaultErrors'),
              [],
            ));
        }),
      );
    },
    [DyOAuth2ResponseType.TOKEN]: () => {
      const module = 'authorize';
      const requireValidToken = this.getOption(`${module}.requireValidToken`);
      return observableOf(this.route.snapshot.fragment).pipe(
        map(fragment => this.parseHashAsQueryParams(fragment)),
        map((params: any) => {
          if (!params.error) {
            return new DyAuthResult(
              true,
              params,
              this.getOption('redirect.success'),
              [],
              this.getOption('defaultMessages'),
              this.createToken(params, requireValidToken));
          }
          return new DyAuthResult(
            false,
            params,
            this.getOption('redirect.failure'),
            this.getOption('defaultErrors'),
            [],
          );
        }),
        catchError(err => {
          const errors = [];
          if (err instanceof DyAuthIllegalTokenError) {
            errors.push(err.message)
          } else {
            errors.push('Something went wrong.');
          }
          return observableOf(
            new DyAuthResult(
              false,
              err,
              this.getOption('redirect.failure'),
              errors,
            ));
        }),
      );
    },
  };

  protected redirectResults: { [key: string]: Function } = {
    [DyOAuth2ResponseType.CODE]: () => {
      return observableOf(this.route.snapshot.queryParams).pipe(
        map((params: any) => !!(params && (params.code || params.error))),
      );
    },
    [DyOAuth2ResponseType.TOKEN]: () => {
      return observableOf(this.route.snapshot.fragment).pipe(
        map(fragment => this.parseHashAsQueryParams(fragment)),
        map((params: any) => !!(params && (params.access_token || params.error))),
      );
    },
  };

  protected defaultOptions: DyOAuth2AuthStrategyOptions = auth2StrategyOptions;

  constructor(protected http: HttpClient,
              protected route: ActivatedRoute,
              @Inject(DY_WINDOW) protected window: any) {
    super();
  }

  authenticate(data?: any): Observable<DyAuthResult> {

    if (this.getOption('token.grantType') === DyOAuth2GrantType.PASSWORD) {
      return this.passwordToken(data.email, data.password)
    } else {
      return this.isRedirectResult()
        .pipe(
          switchMap((result: boolean) => {
            if (!result) {
              this.authorizeRedirect();
              return observableOf(new DyAuthResult(true));
            }
            return this.getAuthorizationResult();
          }),
        );
    }
  }

  getAuthorizationResult(): Observable<any> {
    const redirectResultHandler = this.redirectResultHandlers[this.responseType];
    if (redirectResultHandler) {
      return redirectResultHandler.call(this);
    }

    throw new Error(`'${this.responseType}' responseType is not supported,
                      only 'token' and 'code' are supported now`);
  }

  refreshToken(token: DyAuthRefreshableToken): Observable<DyAuthResult> {
    const module = 'refresh';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    let headers = this.buildAuthHeader() || new HttpHeaders() ;
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(url, this.buildRefreshRequestData(token), { headers: headers })
      .pipe(
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption('redirect.success'),
            [],
            this.getOption('defaultMessages'),
            this.createRefreshedToken(res, token, requireValidToken));
        }),
        catchError((res) => this.handleResponseError(res)),
      );
  }

  passwordToken(username: string, password: string): Observable<DyAuthResult> {
    const module = 'token';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    let headers = this.buildAuthHeader() || new HttpHeaders() ;
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(url, this.buildPasswordRequestData(username, password), { headers: headers })
      .pipe(
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption('redirect.success'),
            [],
            this.getOption('defaultMessages'),
            this.createToken(res, requireValidToken));
        }),
        catchError((res) => this.handleResponseError(res)),
      );
  }

  protected authorizeRedirect() {
    this.window.location.href = this.buildRedirectUrl();
  }

  protected isRedirectResult(): Observable<boolean> {
    return this.redirectResults[this.responseType].call(this);
  }

  protected requestToken(code: string) {

    const module = 'token';
    const url = this.getActionEndpoint(module);
    const requireValidToken = this.getOption(`${module}.requireValidToken`);

    let headers = this.buildAuthHeader() || new HttpHeaders() ;
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(url, this.buildCodeRequestData(code), { headers: headers })
      .pipe(
        map((res) => {
          return new DyAuthResult(
            true,
            res,
            this.getOption('redirect.success'),
            [],
            this.getOption('defaultMessages'),
            this.createToken(res, requireValidToken));
        }),
        catchError((res) => this.handleResponseError(res)),
      );
  }

  protected buildCodeRequestData(code: string): any {
    const params = {
      grant_type: this.getOption('token.grantType'),
      code: code,
      redirect_uri: this.getOption('token.redirectUri'),
      client_id: this.getOption('clientId'),
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildRefreshRequestData(token: DyAuthRefreshableToken): any {
    const params = {
      grant_type: this.getOption('refresh.grantType'),
      refresh_token: token.getRefreshToken(),
      scope: this.getOption('refresh.scope'),
      client_id: this.getOption('clientId'),
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildPasswordRequestData(username: string, password: string ): string {
    const params = {
      grant_type: this.getOption('token.grantType'),
      username: username,
      password: password,
      scope: this.getOption('token.scope'),
    };
    return this.urlEncodeParameters(this.cleanParams(this.addCredentialsToParams(params)));
  }

  protected buildAuthHeader(): any {
    if (this.clientAuthMethod === DyOAuth2ClientAuthMethod.BASIC) {
      if (this.getOption('clientId') && this.getOption('clientSecret')) {
        return new HttpHeaders(
            {
              'Authorization': 'Basic ' + btoa(
                this.getOption('clientId') + ':' + this.getOption('clientSecret')),
            },
          );
      } else {
        throw Error('For basic client authentication method, please provide both clientId & clientSecret.');
      }
    }
  }

  protected cleanParams(params: any): any {
    Object.entries(params)
      .forEach(([key, val]) => !val && delete params[key]);
    return params;
  }

  protected addCredentialsToParams(params: any): any {
    if (this.clientAuthMethod === DyOAuth2ClientAuthMethod.REQUEST_BODY) {
      if (this.getOption('clientId') && this.getOption('clientSecret')) {
        return {
          ... params,
          client_id: this.getOption('clientId'),
          client_secret: this.getOption('clientSecret'),
        }
      } else {
        throw Error('For request body client authentication method, please provide both clientId & clientSecret.')
      }
    }
    return params;
  }


  protected handleResponseError(res: any): Observable<DyAuthResult> {
    let errors = [];
    if (res instanceof HttpErrorResponse) {
      if (res.error.error_description) {
        errors.push(res.error.error_description);
      } else {
        errors = this.getOption('defaultErrors');
      }
    }  else if (res instanceof DyAuthIllegalTokenError ) {
      errors.push(res.message)
    } else {
        errors.push('Something went wrong.')
    };

    return observableOf(
      new DyAuthResult(
        false,
        res,
        this.getOption('redirect.failure'),
        errors,
        [],
      ));
  }

  protected buildRedirectUrl() {
    const params = {
      response_type: this.getOption('authorize.responseType'),
      client_id: this.getOption('clientId'),
      redirect_uri: this.getOption('authorize.redirectUri'),
      scope: this.getOption('authorize.scope'),
      state: this.getOption('authorize.state'),

      ...this.getOption('authorize.params'),
    };

    const endpoint = this.getActionEndpoint('authorize');
    const query = this.urlEncodeParameters(this.cleanParams(params));

    return `${endpoint}?${query}`;
  }

  protected parseHashAsQueryParams(hash: string): { [key: string]: string } {
    return hash ? hash.split('&').reduce((acc: any, part: string) => {
      const item = part.split('=');
      acc[item[0]] = decodeURIComponent(item[1]);
      return acc;
    }, {}) : {};
  }

  protected urlEncodeParameters(params: any): string {
    return Object.keys(params).map((k) => {
      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    }).join('&');
  }

  protected createRefreshedToken(res, existingToken: DyAuthRefreshableToken, requireValidToken: boolean): DyAuthToken {
    type AuthRefreshToken = DyAuthRefreshableToken & DyAuthToken;

    const refreshedToken: AuthRefreshToken = this.createToken<AuthRefreshToken>(res, requireValidToken);
    if (!refreshedToken.getRefreshToken() && existingToken.getRefreshToken()) {
      refreshedToken.setRefreshToken(existingToken.getRefreshToken());
    }
    return refreshedToken;
  }

  register(data?: any): Observable<DyAuthResult> {
    throw new Error('`register` is not supported by `DyOAuth2AuthStrategy`, use `authenticate`.');
  }

  requestPassword(data?: any): Observable<DyAuthResult> {
    throw new Error('`requestPassword` is not supported by `DyOAuth2AuthStrategy`, use `authenticate`.');
  }

  resetPassword(data: any = {}): Observable<DyAuthResult> {
    throw new Error('`resetPassword` is not supported by `DyOAuth2AuthStrategy`, use `authenticate`.');
  }

  logout(): Observable<DyAuthResult> {
    return observableOf(new DyAuthResult(true));
  }
}

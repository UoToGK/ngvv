

import { DyAuthOAuth2Token, DyAuthTokenClass } from '../../services/token/token';
import { DyAuthStrategyOptions } from '../auth-strategy-options';

export enum DyOAuth2ResponseType {
  CODE = 'code',
  TOKEN = 'token',
}

// TODO: client_credentials
export enum DyOAuth2GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
}

export enum DyOAuth2ClientAuthMethod {
  NONE = 'none',
  BASIC = 'basic',
  REQUEST_BODY = 'request-body',
}

export class DyOAuth2AuthStrategyOptions extends DyAuthStrategyOptions {
  baseEndpoint?: string = '';
  clientId: string = '';
  clientSecret?: string = '';
  clientAuthMethod?: string = DyOAuth2ClientAuthMethod.NONE;
  redirect?: { success?: string; failure?: string } = {
    success: '/',
    failure: null,
  };
  defaultErrors?: any[] = ['Something went wrong, please try again.'];
  defaultMessages?: any[] = ['You have been successfully authenticated.'];
  authorize?: {
    endpoint?: string;
    redirectUri?: string;
    responseType?: string;
    requireValidToken?: boolean; // used only with DyOAuth2ResponseType.TOKEN
    scope?: string;
    state?: string;
    params?: { [key: string]: string };
  } = {
    endpoint: 'authorize',
    responseType: DyOAuth2ResponseType.CODE,
    requireValidToken: true,
  };
  token?: {
    endpoint?: string;
    grantType?: string;
    redirectUri?: string;
    scope?: string; // Used only with 'password' grantType
    requireValidToken?: boolean;
    class: DyAuthTokenClass,
  } = {
    endpoint: 'token',
    grantType: DyOAuth2GrantType.AUTHORIZATION_CODE,
    requireValidToken: true,
    class: DyAuthOAuth2Token,
  };
  refresh?: {
    endpoint?: string;
    grantType?: string;
    scope?: string;
    requireValidToken?: boolean;
  } = {
    endpoint: 'token',
    grantType: DyOAuth2GrantType.REFRESH_TOKEN,
    requireValidToken: true,
  };
}

export const auth2StrategyOptions: DyOAuth2AuthStrategyOptions = new DyOAuth2AuthStrategyOptions();

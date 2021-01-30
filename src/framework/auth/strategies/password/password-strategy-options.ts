

import { DyAuthSimpleToken, DyAuthTokenClass } from '../../services/token/token';
import { DyAuthStrategyOptions } from '../auth-strategy-options';
import { getDeepFromObject } from '../../helpers';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface DyPasswordStrategyModule {
  alwaysFail?: boolean;
  endpoint?: string;
  method?: string;
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  requireValidToken?: boolean;
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface DyPasswordStrategyReset extends DyPasswordStrategyModule {
  resetPasswordTokenKey?: string;
}

export interface DyPasswordStrategyToken {
  class?: DyAuthTokenClass,
  key?: string,
  getter?: Function,
}

export interface DyPasswordStrategyMessage {
  key?: string,
  getter?: Function,
}

export class DyPasswordAuthStrategyOptions extends DyAuthStrategyOptions {
  baseEndpoint?: string = '/api/auth/';
  login?: boolean | DyPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: 'login',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  register?: boolean | DyPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: 'register',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  requestPass?: boolean | DyPasswordStrategyModule = {
    endpoint: 'request-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Reset password instructions have been sent to your email.'],
  };
  resetPass?: boolean | DyPasswordStrategyReset = {
    endpoint: 'reset-pass',
    method: 'put',
    redirect: {
      success: '/',
      failure: null,
    },
    resetPasswordTokenKey: 'reset_password_token',
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your password has been successfully changed.'],
  };
  logout?: boolean | DyPasswordStrategyReset = {
    alwaysFail: false,
    endpoint: 'logout',
    method: 'delete',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  refreshToken?: boolean | DyPasswordStrategyModule = {
    endpoint: 'refresh-token',
    method: 'post',
    requireValidToken: true,
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  token?: DyPasswordStrategyToken = {
    class: DyAuthSimpleToken,
    key: 'data.token',
    getter: (module: string, res: HttpResponse<Object>, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
      res.body,
      options.token.key,
    ),
  };
  errors?: DyPasswordStrategyMessage = {
    key: 'data.errors',
    getter: (module: string, res: HttpErrorResponse, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
      res.error,
      options.errors.key,
      options[module].defaultErrors,
    ),
  };
  messages?: DyPasswordStrategyMessage = {
    key: 'data.messages',
    getter: (module: string, res: HttpResponse<Object>, options: DyPasswordAuthStrategyOptions) => getDeepFromObject(
      res.body,
      options.messages.key,
      options[module].defaultMessages,
    ),
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}

export const passwordStrategyOptions: DyPasswordAuthStrategyOptions = new DyPasswordAuthStrategyOptions();

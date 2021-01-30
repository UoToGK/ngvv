import { InjectionToken } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { DyAuthStrategy } from './strategies/auth-strategy';
import { DyAuthStrategyOptions } from './strategies/auth-strategy-options';
import { DyAuthToken, DyAuthTokenClass } from './services/token/token';

export type DyAuthStrategyClass = new (...params: any[]) => DyAuthStrategy;

export type DyAuthStrategies  = [DyAuthStrategyClass, DyAuthStrategyOptions][];

export interface DyAuthOptions {
  forms?: any;
  strategies?: DyAuthStrategies;
}

export interface DyAuthSocialLink {
  link?: string,
  url?: string,
  target?: string,
  title?: string,
  icon?: string,
}

const socialLinks: DyAuthSocialLink[] = [];

export const defaultAuthOptions: any = {
  strategies: [],
  forms: {
    login: {
      redirectDelay: 500, // delay before redirect after a successful login, while success message is shown to the user
      strategy: 'email',  // provider id key. If you have multiple strategies, or what to use your own
      rememberMe: true,   // whether to show or not the `rememberMe` checkbox
      showMessages: {     // show/not show success/error messages
        success: true,
        error: true,
      },
      socialLinks: socialLinks, // social links at the bottom of a page
    },
    register: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      terms: true,
      socialLinks: socialLinks,
    },
    requestPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    resetPassword: {
      redirectDelay: 500,
      strategy: 'email',
      showMessages: {
        success: true,
        error: true,
      },
      socialLinks: socialLinks,
    },
    logout: {
      redirectDelay: 500,
      strategy: 'email',
    },
    validation: {
      password: {
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      email: {
        required: true,
      },
      fullName: {
        required: false,
        minLength: 4,
        maxLength: 50,
      },
    },
  },
};

export const DY_AUTH_OPTIONS = new InjectionToken<DyAuthOptions>('Nebular Auth Options');
export const DY_AUTH_USER_OPTIONS = new InjectionToken<DyAuthOptions>('Nebular User Auth Options');
export const DY_AUTH_STRATEGIES = new InjectionToken<DyAuthStrategies>('Nebular Auth Strategies');
export const DY_AUTH_TOKENS = new InjectionToken<DyAuthTokenClass<DyAuthToken>[]>('Nebular Auth Tokens');
export const DY_AUTH_INTERCEPTOR_HEADER = new InjectionToken<string>('Nebular Simple Interceptor Header');
export const DY_AUTH_TOKEN_INTERCEPTOR_FILTER =
       new InjectionToken<(req: HttpRequest<any>) => boolean>('Nebular Interceptor Filter');


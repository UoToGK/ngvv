import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';


import { DyAuthService } from './services/auth.service';
import { DyAuthSimpleToken, DyAuthTokenClass } from './services/token/token';
import { DyTokenLocalStorage, DyTokenStorage } from './services/token/token-storage';
import { DyTokenService } from './services/token/token.service';
import { DyAuthTokenParceler, DY_AUTH_FALLBACK_TOKEN } from './services/token/token-parceler';
import { DyAuthStrategy } from './strategies/auth-strategy';
import { DyAuthStrategyOptions } from './strategies/auth-strategy-options';
import { DyDummyAuthStrategy } from './strategies/dummy/dummy-strategy';
import { DyOAuth2AuthStrategy } from './strategies/oauth2/oauth2-strategy';
import { DyPasswordAuthStrategy } from './strategies/password/password-strategy';

import {
  defaultAuthOptions,
  DY_AUTH_INTERCEPTOR_HEADER,
  DY_AUTH_OPTIONS,
  DY_AUTH_STRATEGIES,
  DY_AUTH_TOKEN_INTERCEPTOR_FILTER,
  DY_AUTH_TOKENS,
  DY_AUTH_USER_OPTIONS,
  DyAuthOptions,
  DyAuthStrategyClass,
} from './auth.options';

import { DyAuthComponent } from './components/auth.component';

import { DyAuthBlockComponent } from './components/auth-block/auth-block.component';
import { DyLoginComponent } from './components/login/login.component';
import { DyRegisterComponent } from './components/register/register.component';
import { DyLogoutComponent } from './components/logout/logout.component';
import { DyRequestPasswordComponent } from './components/request-password/request-password.component';
import { DyResetPasswordComponent } from './components/reset-password/reset-password.component';

import { deepExtend } from './helpers';
import { DyLayoutModule, DyCardModule, DyCheckboxModule, DyAlertModule, DyInputModule, DyButtonModule, DyIconModule } from '../theme/public_api';

export function dyStrategiesFactory(options: DyAuthOptions, injector: Injector): DyAuthStrategy[] {
  const strategies = [];
  options.strategies
    .forEach(([strategyClass, strategyOptions]: [DyAuthStrategyClass, DyAuthStrategyOptions]) => {
      const strategy: DyAuthStrategy = injector.get(strategyClass);
      strategy.setOptions(strategyOptions);

      strategies.push(strategy);
    });
  return strategies;
}

export function dyTokensFactory(strategies: DyAuthStrategy[]): DyAuthTokenClass[] {
  const tokens = [];
  strategies
    .forEach((strategy: DyAuthStrategy) => {
      tokens.push(strategy.getOption('token.class'));
    });
  return tokens;
}

export function dyOptionsFactory(options) {
  return deepExtend(defaultAuthOptions, options);
}

export function dyNoOpInterceptorFilter(req: HttpRequest<any>): boolean {
  return true;
}

@NgModule({
  imports: [
    CommonModule,
    DyLayoutModule,
    DyCardModule,
    DyCheckboxModule,
    DyAlertModule,
    DyInputModule,
    DyButtonModule,
    RouterModule,
    FormsModule,
    DyIconModule,
  ],
  declarations: [
    DyAuthComponent,
    DyAuthBlockComponent,
    DyLoginComponent,
    DyRegisterComponent,
    DyRequestPasswordComponent,
    DyResetPasswordComponent,
    DyLogoutComponent,
  ],
  exports: [
    DyAuthComponent,
    DyAuthBlockComponent,
    DyLoginComponent,
    DyRegisterComponent,
    DyRequestPasswordComponent,
    DyResetPasswordComponent,
    DyLogoutComponent,
  ],
})
export class DyAuthModule {
  static forRoot(dyAuthOptions?: DyAuthOptions): ModuleWithProviders<DyAuthModule> {
    return {
      ngModule: DyAuthModule,
      providers: [
        { provide: DY_AUTH_USER_OPTIONS, useValue: dyAuthOptions },
        { provide: DY_AUTH_OPTIONS, useFactory: dyOptionsFactory, deps: [DY_AUTH_USER_OPTIONS] },
        { provide: DY_AUTH_STRATEGIES, useFactory: dyStrategiesFactory, deps: [DY_AUTH_OPTIONS, Injector] },
        { provide: DY_AUTH_TOKENS, useFactory: dyTokensFactory, deps: [DY_AUTH_STRATEGIES] },
        { provide: DY_AUTH_FALLBACK_TOKEN, useValue: DyAuthSimpleToken },
        { provide: DY_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
        { provide: DY_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: dyNoOpInterceptorFilter },
        { provide: DyTokenStorage, useClass: DyTokenLocalStorage },
        DyAuthTokenParceler,
        DyAuthService,
        DyTokenService,
        DyDummyAuthStrategy,
        DyPasswordAuthStrategy,
        DyOAuth2AuthStrategy,
      ],
    };
  }
}

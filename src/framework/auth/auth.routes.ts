
import { Routes } from '@angular/router';

import { DyAuthComponent } from './components/auth.component';
import { DyLoginComponent } from './components/login/login.component';
import { DyRegisterComponent } from './components/register/register.component';
import { DyLogoutComponent } from './components/logout/logout.component';
import { DyRequestPasswordComponent } from './components/request-password/request-password.component';
import { DyResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: DyAuthComponent,
    children: [
      {
        path: '',
        component: DyLoginComponent,
      },
      {
        path: 'login',
        component: DyLoginComponent,
      },
      {
        path: 'register',
        component: DyRegisterComponent,
      },
      {
        path: 'logout',
        component: DyLogoutComponent,
      },
      {
        path: 'request-password',
        component: DyRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: DyResetPasswordComponent,
      },
    ],
  },
];

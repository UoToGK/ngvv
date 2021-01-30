import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  DyAuthComponent,
  DyLoginComponent,
  DyLogoutComponent,
  DyRegisterComponent,
  DyRequestPasswordComponent,
  DyResetPasswordComponent,
} from '../framework/auth/public_api';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
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
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
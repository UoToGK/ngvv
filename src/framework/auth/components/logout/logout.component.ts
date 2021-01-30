
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DY_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';
import { DyAuthService } from '../../services/auth.service';
import { DyAuthResult } from '../../services/auth-result';

@Component({
  selector: 'dy-logout',
  templateUrl: './logout.component.html',
})
export class DyLogoutComponent implements OnInit {

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(protected service: DyAuthService,
              @Inject(DY_AUTH_OPTIONS) protected options = {},
              protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {
    this.service.logout(strategy).subscribe((result: DyAuthResult) => {

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}

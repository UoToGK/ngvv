
import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { DyAuthService } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'dy-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <dy-layout>
      <dy-layout-column>
        <dy-card>
          <dy-card-header>
            <nav class="navigation">
              <a href="#" (click)="back()" class="link back-link" aria-label="Back">
                <dy-icon icon="arrow-back"></dy-icon>
              </a>
            </nav>
          </dy-card-header>
          <dy-card-body>
            <dy-auth-block>
              <router-outlet></router-outlet>
            </dy-auth-block>
          </dy-card-body>
        </dy-card>
      </dy-layout-column>
    </dy-layout>
  `,
})
export class DyAuthComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  subscription: any;

  authenticated: boolean = false;
  token: string = '';

  // showcase of how to use the onAuthenticationChange method
  constructor(protected auth: DyAuthService, protected location: Location) {

    this.subscription = auth.onAuthenticationChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

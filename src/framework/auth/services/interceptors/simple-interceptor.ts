import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DyAuthService } from '../auth.service';
import { DY_AUTH_INTERCEPTOR_HEADER } from '../../auth.options';
import { DyAuthJWTToken } from '../token/token';

@Injectable()
export class DyAuthSimpleInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              @Inject(DY_AUTH_INTERCEPTOR_HEADER) protected headerName: string = 'Authorization') {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.getToken()
      .pipe(
        switchMap((token: DyAuthJWTToken) => {
          if (token && token.getValue()) {
            req = req.clone({
              setHeaders: {
                [this.headerName]: token.getValue(),
              },
            });
          }
          return next.handle(req);
        }),
      );
  }

  protected get authService(): DyAuthService {
    return this.injector.get(DyAuthService);
  }
}

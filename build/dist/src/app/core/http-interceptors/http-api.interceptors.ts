import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '@portal/auth/services/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { INTERCEPTOR_SKIP_HEADER } from '@portal/shared/constants/common.constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

type NewType = Injector;

@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {
    tokenBeingRefreshed: boolean = false;
    readonly MESSAGE = 'jwt expired';
    readonly NAME = 'TokenExpiredError';

    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (req.headers.has(INTERCEPTOR_SKIP_HEADER)) {
            const headers = req.headers.delete(INTERCEPTOR_SKIP_HEADER).append('Authorization', `Bearer ${token}`);

            return next.handle(req.clone({ headers })).pipe(
                catchError((error) => {
                    return this.handleError(error);
                })
            );
        }

        const option = token
            ? {
                  setHeaders: {
                      'Content-Type': 'application/json; charset=utf-8',
                      Accept: 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              }
            : {};

        const apiReq = req.clone(option);
        return next.handle(apiReq).pipe(
            tap((event) => {
                if (req.method === 'GET' && event instanceof HttpResponse) {
                    const key = 'frontendversion';
                    const remoteFrontEndVersion = event.headers.get(key);
                    const localFrontEndVersion = localStorage.getItem(key);
                    if (remoteFrontEndVersion !== localFrontEndVersion) {
                        localStorage.setItem(key, '1');
                        document.location.reload();
                    }
                }
            }),
            catchError((error) => {
                return this.handleError(error);
            })
        );
    }

    handleError = (error: HttpErrorResponse) => {
        if (error?.error?.name?.includes('TokenExpiredError')) {
            this.toastr.error('Login expired', 'Authentication');
            this.authService.logout();
            this.router.navigate(['/login']);
        }

        return throwError(error);
    };
}

export enum HttpStatusCode {
    Unauthorised = 401,
    Forbidden = 403
}

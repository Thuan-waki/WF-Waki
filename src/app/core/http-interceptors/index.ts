/* "Barrel" of Http Interceptors; see HttpClient docs and sample code for more info */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpApiInterceptor } from './http-api.interceptors';
import { StripUndefinedParamsHttpInterceptor } from './http-strip-undefined-params.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: StripUndefinedParamsHttpInterceptor, multi: true }
];

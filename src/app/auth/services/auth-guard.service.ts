import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { hasRequired } from '@portal/shared/functions/has-required';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isAuthorised(next);
    }

    isAuthorised(next: ActivatedRouteSnapshot) {
        if (!this.authService.isLoggedIn()) {
            localStorage.setItem('waki_redirect', window.localStorage.href);

            this.router.navigateByUrl('/login');
            return false;
        }

        const required = (next.data.claims as string[]) || [];
        const having = this.authService.userRoles() || [];

        return hasRequired(required, having);
    }
}

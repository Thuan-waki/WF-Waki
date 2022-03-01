import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Credentials, defaultUser, IUser } from '@portal/shared/models/user.model';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { hasRequired } from '@portal/shared/functions/has-required';
import { IOtpLogin } from '../models/otp-login.model';
import { ILoginResult, IOtpLoginResult } from '../models/login-result.model';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ISchool } from '@portal/school/models/school.model';
import { translationLang } from '@portal/shared/functions/translate-language';

const JWT_TOKEN = `jwttoken`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: IUser = defaultUser;
    userEmail: string = '';

    constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

    login({ email, password }: Credentials): Observable<ILoginResult> {
        const credentials = JSON.stringify({ email, password });

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.httpClient.post<ILoginResult>(`/api/v2/users/login?type=EMAIL`, credentials, httpOptions);
    }

    loginOtp(otpLogin: IOtpLogin): Observable<IOtpLoginResult> {
        return this.httpClient.post<IOtpLoginResult>('/api/v2/users/login-otp-verification', otpLogin);
    }

    getUserProfile(): Observable<IApiResult> {
        return this.httpClient.get<IApiResult>('api/v2/users/me');
    }

    forgotPasswordStepOne = (email: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/users/forgot-password?step=1&type=EMAIL`, { email: email });
    };

    forgotPasswordStepTwo = (email: string, verificationCode: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/users/forgot-password?step=2&type=EMAIL`, {
            email: email,
            verificationCode: verificationCode
        });
    };

    forgotPasswordStepThree = (email: string, newPassword: string) => {
        return this.httpClient.patch<IApiResult>(`api/v2/users/forgot-password?step=3&type=EMAIL`, {
            email: email,
            newPassword: newPassword
        });
    };

    isLoggedIn = () => {
        if (!this.user || !this.user.email) {
            const usr = this.localStorageUser;

            if (!usr || !usr.token) {
                return false;
            }

            this.userEmail = usr.email;
            this.setUser(usr);
            this.setToken(usr.token);
        }

        return true;
    };

    loadUserFromLocal = (): Observable<IUser> => {
        return of(this.localStorageUser!);
    };

    setUser = (user: IUser) => {
        this.user = { ...this.user, ...user };

        localStorage.setItem('wakiUser', JSON.stringify(this.user));
    };

    get localStorageUser(): IUser | null {
        const wakiUser = localStorage.getItem('wakiUser');

        if (wakiUser === 'undefined') {
            return null;
        }

        return JSON.parse(wakiUser!) as IUser;
    }

    loadEmailFromStorage = () => {
        return of(this.localEmail);
    };

    get localEmail() {
        const email = localStorage.getItem('wakiUserEmail');

        if (email === 'undefined') {
            return null;
        }

        return JSON.parse(email!);
    }

    setUserEmail = (email: string) => {
        this.userEmail = email;
        this.user = { ...this.user, email: email };
        localStorage.setItem('wakiUserEmail', JSON.stringify({ email: email }));
    };

    clearUserEmail = () => {
        this.userEmail = '';
        localStorage.removeItem('wakiUserEmail');
    };

    setStorageUser = (user: IUser) => {
        this.user = user;
        localStorage.setItem('wakiUser', JSON.stringify(user));
    };

    setToken = (token: string) => {
        this.cookieService.set(JWT_TOKEN, token);
    };

    clearUser = () => {
        this.user = defaultUser;
        localStorage.removeItem('wakiUser');
        this.cookieService.delete(JWT_TOKEN);
    };

    userRoles = (): string[] => {
        const user = this.localStorageUser;
        const rolesString = user && user.roles;
        if (!rolesString) {
            return [];
        }

        return rolesString;
    };

    isSuperAdmin = (): boolean => {
        return this.doesHaveRoles([UserRoles.WAKI_SUPER_ADMIN]);
    };

    isAdmin = (): boolean => {
        return this.doesHaveRoles([UserRoles.WAKI_ADMIN]);
    };

    isAdminOrSuperAdmin = (): boolean => {
        return this.doesHaveRoles([UserRoles.WAKI_SUPER_ADMIN, UserRoles.WAKI_ADMIN]);
    };

    isSchoolUser = (): boolean => {
        return this.doesHaveRoles([UserRoles.SCHOOL_USER]);
    };

    isSuperSchoolUser = (): boolean => {
        return this.doesHaveRoles([UserRoles.SUPER_SCHOOL_USER]);
    };

    isCanteenUser = (): boolean => {
        return this.doesHaveRoles([UserRoles.CANTEEN_USER]);
    };

    isSuperCanteenUser = (): boolean => {
        return this.doesHaveRoles([UserRoles.SUPER_CANTEEN_USER]);
    };

    doesHaveRoles = (claims: string[]) => {
        return hasRequired(claims, this.userRoles());
    };

    getToken = (): string | null | undefined => {
        const user = this.localStorageUser;
        return user && user.token;
    };

    getUserCanteenId = (): string => {
        return this.localStorageUser?.canteens[0]?._id || '';
    };

    getUserCanteenName = (): string => {
        return translationLang(this.localStorageUser?.canteens[0]?.translations);
    };

    getUserCanteenCode = (): string => {
        return this.localStorageUser?.canteens[0]?.canteenId || '';
    };

    getUserSchoolId = (): string => {
        return this.localStorageUser?.schools[0]?._id || '';
    };

    getUserSchoolName = (): string => {
        return translationLang(this.localStorageUser?.schools[0]?.translations);
    };

    getUserSchools = (): ISchool[] => {
        return this.localStorageUser?.schools || [];
    };

    logout() {
        this.user = defaultUser;
        this.userEmail = '';
        localStorage.removeItem('wakiUser');
    }
}

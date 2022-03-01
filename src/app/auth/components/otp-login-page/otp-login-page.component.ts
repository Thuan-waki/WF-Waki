import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, takeUntil } from 'rxjs/operators';
import { AuthService } from '@portal/auth/services/auth.service';
import { of } from 'rxjs';
import { IOtpLogin } from '@portal/auth/models/otp-login.model';
import { IOtpLoginResult } from '@portal/auth/models/login-result.model';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { IUser } from '@portal/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

type NewType = ChangeDetectorRef;

@Component({
    selector: 'app-otp-login-page',
    templateUrl: './otp-login-page.component.html',
    styleUrls: ['./otp-login-page.component.scss']
})
export class OtpLoginPageComponent extends ComponentBase implements OnInit {
    form: FormGroup = this.fb.group({
        otp: ['', [Validators.required]]
    });
    url: string = '';
    email: string = '';
    isLoading: boolean = false;
    alert: string = '';
    error: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        super();
        this.url = this.route.snapshot.params.url;
    }

    ngOnInit(): void {
        this.email = this.authService.userEmail;

        if (!this.email || !this.email.length) {
            this.router.navigateByUrl('login');
        }
    }

    onVerify = () => {
        if (!this.FormIsValid) {
            return;
        }

        this.isLoading = true;
        const formValue = this.form.getRawValue();

        this.authService
            .loginOtp({ email: this.email, otp: formValue.otp })
            .pipe(
                takeUntil(this.destroyed$),
                catchError((err) => {
                    this.isLoading = false;
                    return of<IOtpLoginResult>();
                })
            )
            .subscribe((res: IOtpLoginResult) => {
                if (res.success) {
                    this.authService.setUser({
                        ...this.authService.user,
                        isProfileSetup: res.isProfileSetup,
                        permissions: res.permissions,
                        token: res.token,
                        refreshToken: res.refreshToken,
                        roles: res.roles
                    });

                    this.authService.setToken(res.token);

                    this.loadUserProfile();
                } else {
                    this.isLoading = false;
                    this.error = res.msg;
                }
            });
    };

    loadUserProfile = () => {
        this.authService
            .getUserProfile()
            .pipe(
                takeUntil(this.destroyed$),
                catchError(() => {
                    return of<IApiResult>();
                })
            )
            .subscribe((res: IApiResult) => {
                if (res.success && res.profile) {
                    this.toastr.success('OTP Accepted', 'Login');
                    this.authService.setUser(res.profile as IUser);
                    this.redirectBeacuseLogin();
                } else {
                    this.error = 'Something went wrong, please try again';
                    this.isLoading = false;
                }
            });
    };

    redirectBeacuseLogin = () => {
        const redirectTo = localStorage.getItem('waki_redirect');

        if (redirectTo) {
            window.location.href = redirectTo;
            return;
        }

        this.router.navigateByUrl('');
    };

    get FormIsValid() {
        return this.form && this.form.valid;
    }
}

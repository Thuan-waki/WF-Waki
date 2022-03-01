import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILoginResult } from '@portal/auth/models/login-result.model';
import { AuthService } from '@portal/auth/services/auth.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { Credentials } from '@portal/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SignUpInfoDialogComponent } from '../sign-up-info-dialog/sign-up-info-dialog.component';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends ComponentBase {
    form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });
    inputType: string = 'password';
    visible: boolean = false;
    url: string = '';
    isProduction = environment.production;
    alert: string = '';
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        public modalService: NgbModal,
        private toastr: ToastrService
    ) {
        super();
        this.url = this.route.snapshot.params.url;

        if (this.authService.isLoggedIn()) {
            this.router.navigateByUrl('');
        }
    }

    onLogin = () => {
        if (!this.FormIsValid) {
            return;
        }

        this.isLoading = true;

        const formValue = this.form.getRawValue();

        this.alert = '';
        this.cd.detectChanges();

        const credentials: Credentials = {
            email: formValue.email,
            password: formValue.password
        };

        this.authService
            .login(credentials)
            .pipe(
                takeUntil(this.destroyed$),
                catchError((err) => {
                    if (err.status && err.status === 504) {
                        this.alert = 'Please check your internet connection';
                    } else {
                        this.alert = err.error?.msg;
                    }

                    this.isLoading = false;
                    return of<ILoginResult>();
                })
            )
            .subscribe((res) => {
                if (res.otpSent) {
                    this.toastr.success('Login Successful', 'Login');
                    this.authService.setUserEmail(credentials.email);
                    this.goToOtpPage();
                } else {
                    this.alert = 'Something went wrong, please try again';
                }
            });
    };

    goToForgotPassword = () => {
        this.router.navigateByUrl('/auth/forgot-password');
    };

    goToOtpPage = () => {
        this.router.navigateByUrl('/login/otp');
    };

    showSignUpInfo = () => {
        const modalRef = this.modalService.open(SignUpInfoDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.result.then(() => {}).catch();
    };

    get FormIsValid() {
        return this.form && this.form.valid;
    }
}

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { mustMatch } from '@portal/shared/validators/password-validators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.component.html',
    styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent extends ComponentBase {
    currentStep: number = 1;
    isLoading = false;
    form: FormGroup = this.fb.group(
        {
            email: [null, [Validators.required]],
            validationCode: [null, [Validators.required]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required]]
        },
        {
            validators: mustMatch('password', 'confirmPassword')
        }
    );
    notValid: boolean = false;

    get email() {
        return this.form.get('email') as FormControl;
    }

    get validationCode() {
        return this.form.get('validationCode') as FormControl;
    }

    get password() {
        return this.form.get('password') as FormControl;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {
        super();
    }

    processStepOne = () => {
        if (this.currentStep !== 1 || !this.email.valid) {
            return;
        }

        this.isLoading = true;

        const email = this.email.value;

        this.authService
            .forgotPasswordStepOne(email)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.toastr.success(
                            'We have sent you validation code, please check your email',
                            'Forgot Password'
                        );
                    }

                    this.nextStep();
                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Password recovery faild, please try again later', 'Forgot Password');
                    this.isLoading = false;

                    return of();
                })
            )
            .subscribe();
    };

    processStepTwo = () => {
        if (this.currentStep !== 2 || !this.validationCode.valid) {
            return;
        }

        this.isLoading = true;
        this.notValid = false;

        this.authService
            .forgotPasswordStepTwo(this.email.value, this.validationCode.value)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.toastr.success('Validation code accepted, please provide new password', 'Forgot Password');
                        this.nextStep();
                    } else {
                        this.notValid = true;
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Password recovery faild, please try again later', 'Forgot Password');
                    this.isLoading = false;

                    return of();
                })
            )
            .subscribe();
    };

    processStepThree = () => {
        if (this.currentStep !== 3 || !this.password.valid) {
            return;
        }

        this.isLoading = true;

        this.authService
            .forgotPasswordStepThree(this.email.value, this.password.value)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.toastr.success('Password change success, please proceed to login', 'Forgot Password');
                        this.goToLoginPage();
                    } else {
                        this.notValid = true;
                        this.isLoading = false;
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Password recovery faild, please try again later', 'Forgot Password');
                    this.isLoading = false;

                    return of();
                })
            )
            .subscribe();
    };

    nextStep = () => {
        this.currentStep++;
    };

    previousStep = () => {
        this.currentStep--;
    };

    goToLoginPage = () => {
        this.router.navigateByUrl('login');
    };

    goToFirstStep = () => {
        this.currentStep = 1;
    };
}

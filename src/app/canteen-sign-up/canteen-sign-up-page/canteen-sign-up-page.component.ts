import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SchoolService } from '@portal/school/services/school.service';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { LocationService } from '@portal/shared/services/location.service';
import { mustMatch } from '@portal/shared/validators/password-validators';

// TODO: Handle user exist or continue signup
@Component({
    selector: 'app-canteen-sign-up-page',
    templateUrl: './canteen-sign-up-page.component.html',
    styleUrls: ['./canteen-sign-up-page.component.scss']
})
export class CanteenSignUpPageComponent {
    form: FormGroup | undefined;
    otpForm: FormGroup | undefined;
    canteenForm: FormGroup | undefined;
    currentStep = 1;
    isLoading = true;
    schools: ISelectOption[] = [];
    countries: ISelectOption[] = [];
    cities: ISelectOption[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private schoolService: SchoolService,
        private locationService: LocationService
    ) {
        this.form = this.createUserForm();
        this.otpForm = this.createOtpForm();
        this.canteenForm = this.createCanteenForm();
    }

    createUserForm = () => {
        return this.fb.group(
            {
                translations: this.fb.group({
                    en: [null, [Validators.required]],
                    ar: [null, [Validators.required]]
                }),
                email: [null, [Validators.required]],
                password: [null, [Validators.required]],
                confirmPassword: [null, [Validators.required]]
            },
            {
                validators: mustMatch('password', 'confirmPassword')
            }
        );
    };

    createOtpForm = () => {
        return this.fb.group({
            otp: [null, [Validators.required]]
        });
    };

    createCanteenForm = () => {
        return this.fb.group({
            translations: this.fb.group({
                en: [null, [Validators.required]],
                ar: [null, [Validators.required]]
            }),
            canteenId: [null, [Validators.required]],
            address: [null],
            city: [null],
            country: [null],
            schools: [null]
        });
    };

    loadSchools = async () => {
        const apiResult: IApiResult = await this.schoolService
            .getSelectSchools(['id', 'translations'])
            .toPromise()
            .catch();

        if (apiResult.success) {
            this.schools = (apiResult.schools || []).map((school) => {
                return {
                    value: school._id,
                    label: translationLang(school.translations)
                };
            });

            if (this.schools.length) {
                this.canteenForm?.get('schools')?.setValue(this.schools[0].value);
                this.canteenForm?.get('schools')?.updateValueAndValidity();
            }
        }
    };

    loadCities = async (countriId: string) => {
        const apiResult: IApiResult = await this.locationService.getCities(countriId).toPromise().catch();

        if (apiResult.success) {
            this.cities = (apiResult.cities || []).map((city) => {
                return {
                    value: city._id,
                    label: translationLang(city.translations)
                };
            });

            if (this.cities.length) {
                this.canteenForm?.get('city')?.setValue(this.cities[0]?.value);
                this.canteenForm?.get('city')?.updateValueAndValidity();
            }
        }
    };

    loadCountries = async () => {
        const apiResult: IApiResult = await this.locationService.getCountries().toPromise().catch();

        if (apiResult.success) {
            this.countries = (apiResult.countries || []).map((country) => {
                return {
                    value: country._id,
                    label: translationLang(country.translations)
                };
            });

            if (this.countries.length) {
                this.loadCities(this.countries[0]?.value);
                this.canteenForm?.get('country')?.setValue(this.countries[0].value);
                this.canteenForm?.get('country')?.updateValueAndValidity();
            }
        }
    };

    map = () => {
        const formValue = this.form?.getRawValue();

        return {
            translations: {
                en: formValue.translations?.en,
                ar: formValue.translations?.ar
            },
            email: formValue.email,
            password: formValue.password
        };
    };

    signUp = () => {
        this.nextStep();

        if (!this.form?.valid) {
            return;
        }

        this.nextStep();

        const canteenUser = this.map();
    };

    mapCanteen = () => {
        return {};
    };

    submitCanteen = () => {
        if (!this.canteenForm?.valid) {
            return;
        }

        const canteen = this.mapCanteen();
    };

    verifyOtp = () => {
        // TODO: Verify OTP after User Sign up success

        // if success

        this.loadSchools();
        this.loadCountries();
    };

    nextStep = () => {
        this.currentStep++;
    };

    previousStep = () => {
        this.currentStep--;
    };

    cancel = () => {
        this.router.navigateByUrl('');
    };

    get shouldDisableSignUpButton() {
        return !this.form || !this.form.valid || this.isLoading || this.currentStep !== 1;
    }

    get shouldDisableVerifyButton() {
        return !this.otpForm || !this.otpForm.valid || this.isLoading || this.currentStep !== 2;
    }

    get shouldDisableSubmitCanteenButton() {
        return !this.canteenForm || this.isLoading || this.currentStep !== 3;
    }
}

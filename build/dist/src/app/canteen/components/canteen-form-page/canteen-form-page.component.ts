import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { IBank } from '@portal/shared/models/bank.model';
import { ICity } from '@portal/shared/models/city.model';
import { ICountry } from '@portal/shared/models/country.model';
import { BankService } from '@portal/shared/services/bank.service';
import { LocationService } from '@portal/shared/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-form-page',
    templateUrl: './canteen-form-page.component.html',
    styleUrls: ['./canteen-form-page.component.scss']
})
export class CanteenFormPageComponent extends ComponentBase {
    form: FormGroup | undefined;
    currentUserRoles: string[] = [];
    canteen: ICanteen | undefined;
    banks: IBank[] = [];
    isLoading: boolean = true;
    isEditing: boolean = true;
    schoolOptions: any = [];
    bankOptions: any = [];
    countries: ICountry[] = [];
    cities: ICity[] = [];

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private authService: AuthService,
        private canteenService: CanteenService,
        private bankService: BankService,
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();
        this.currentUserRoles = this.authService.userRoles();

        if (
            !this.currentUserRoles.includes(UserRoles.WAKI_ADMIN) &&
            !this.currentUserRoles.includes(UserRoles.WAKI_SUPER_ADMIN)
        ) {
            this.toastr.error('Unauthorized Access', 'Canteen');
            this.goToCanteenList();
        }
        const id = this.route.snapshot.params.id;

        if (id) {
            this.getCanteen(id);
            this.isEditing = true;
        } else {
            this.createForm();
            this.getBanks();
            this.isEditing = false;
            this.isLoading = false;
        }

        this.getCountries().pipe(takeUntil(this.destroyed$)).subscribe();
    }

    getCanteen = (id: string) => {
        this.canteenService
            .getCanteen(id)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.canteen = result.canteen;
                        this.createForm(this.canteen);
                        this.getBanks();
                    }

                    if (!result.success) {
                        this.toastr.error('Failed to retrieve canteen', 'Canteen');
                        this.isLoading = false;
                        this.goToCanteenList();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve canteen', 'Canteen');
                    this.isLoading = false;
                    this.goToCanteenList();
                    return of();
                })
            )
            .subscribe();
    };

    getBanks = () => {
        this.bankService
            .getBanks()
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.banks = result.banks || [];
                        this.bankOptions = this.banks.map((bank) => {
                            return {
                                label: translationLang(bank?.translations),
                                value: bank?._id
                            };
                        });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getCountries = () => {
        return this.locationService.getCountries().pipe(
            tap((result: IApiResult) => {
                if (result.success) {
                    this.countries = result.countries || [];

                    if (this.countries.length) {
                        this.getCities(this.countries[0]._id);
                    }
                }
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.toastr.error('Failed to retrieve Countries', ' Country');
                return of();
            })
        );
    };

    getCities = (countryId: string) => {
        return this.locationService
            .getCities(countryId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.cities = result.cities || [];
                    }
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.isLoading = false;
                    this.toastr.error('Failed to retrieve cities', 'Cities');
                    return of();
                })
            )
            .subscribe();
    };

    createForm = (canteen?: ICanteen) => {
        this.form = this.fb.group({
            address: [canteen?.address || '', [Validators.required]],
            canteenId: [canteen?.canteenId || '', [Validators.required]],
            numOfStudents: [{ value: this.calculateNoOfStudents() || '', disabled: true }],
            currentSubscriptionEnds: [{ value: GetDisplayDate(canteen?.currentSubscriptionEnds), disabled: true }],
            currentSubscriptionStarts: [{ value: GetDisplayDate(canteen?.currentSubscriptionStarts), disabled: true }],
            email: [canteen?.email || '', [Validators.required]],
            mobileNo: [canteen?.mobileNo || '', [Validators.required]],
            phone: [canteen?.phone || '', [Validators.required]],
            transactionFee: [canteen?.transactionFee || '', [Validators.required]],
            vat: [canteen?.vat || ''],
            vatPercentage: [canteen?.vatPercentage || ''],
            translations: this.fb.group({
                en: [canteen?.translations?.en || '', [Validators.required]],
                ar: [canteen?.translations?.ar || '', [Validators.required]]
            }),
            officialNameTranslations: this.fb.group({
                en: [canteen?.officialNameTranslations?.en || '', [Validators.required]],
                ar: [canteen?.officialNameTranslations?.ar || '', [Validators.required]]
            }),
            bankAccount: this.fb.group({
                accountNo: [canteen?.bankAccount?.accountNo || '', [Validators.required]],
                accountName: [canteen?.bankAccount?.accountName || '', [Validators.required]],
                IBAN: [canteen?.bankAccount?.IBAN || '', [Validators.required]],
                bank: [canteen?.bankAccount?.bank || '', [Validators.required]]
            }),
            streetAddress: this.fb.group({
                unitNo: [canteen?.streetAddress?.unitNo || '', [Validators.required]],
                buildingNo: [canteen?.streetAddress?.buildingNo || '', [Validators.required]],
                street: [canteen?.streetAddress?.street || '', [Validators.required]],
                district: [canteen?.streetAddress?.district || '', [Validators.required]],
                city: [canteen?.streetAddress?.city || '', [Validators.required]],
                zipCode: [canteen?.streetAddress?.zipCode || '', [Validators.required]],
                country: [canteen?.streetAddress?.country || '', [Validators.required]],
                additional: [canteen?.streetAddress?.additional || '', [Validators.required]]
            })
        });
    };

    map = () => {
        const formValues = this.form?.getRawValue();

        const canteen: any = {
            address: formValues.address,
            canteenId: formValues.canteenId,
            email: formValues.email,
            mobileNo: formValues.mobileNo,
            phone: formValues.phone,
            transactionFee: formValues.transactionFee,
            vat: formValues.vat,
            vatPercentage: formValues.vatPercentage,
            translations: {
                en: formValues.translations.en,
                ar: formValues.translations.ar
            },
            officialNameTranslations: {
                en: formValues.officialNameTranslations.en,
                ar: formValues.officialNameTranslations.ar
            },
            bankAccount: formValues.bankAccount,
            streetAddress: {
                unitNo: formValues.streetAddress.unitNo,
                buildingNo: formValues.streetAddress.buildingNo,
                street: formValues.streetAddress.street,
                district: formValues.streetAddress.district,
                city: formValues.streetAddress.city,
                zipCode: formValues.streetAddress.zipCode,
                country: formValues.streetAddress.country,
                additional: formValues.streetAddress.additional
            }
        };

        return canteen;
    };

    save = () => {
        if (!this.form?.valid) {
            return;
        }

        this.isLoading = true;

        const canteen = this.map();

        const obs = this.isEditing ? this.patchCanteen(this.canteen?._id || '', canteen) : this.createCanteen(canteen);

        obs.pipe(
            tap((result) => {
                if (result.success) {
                    this.toastr.success('Canteen Saved', 'Canteen');
                    this.goToCanteenList();
                }

                this.isLoading = false;
            }),
            takeUntil(this.destroyed$),
            catchError(() => {
                this.toastr.error('Failed to Save Canteen', 'Canteen');
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    createCanteen = (Canteen: ICanteen) => {
        return this.canteenService.createCanteen(Canteen);
    };

    patchCanteen = (id: string, Canteen: ICanteen) => {
        return this.canteenService.patchCanteen(id, Canteen);
    };

    goToCanteenList = () => {
        this.router.navigate(['/canteens']);
    };

    calculateNoOfStudents = () => {
        if (!this.canteen) {
            return '';
        }

        return this.canteen?.schools
            ?.map((school) => school.noOfStudents)
            ?.reduce((a, b) => {
                return (a || 0) + (b || 0);
            });
    };

    get shouldDisableSaveButton() {
        return !this.form?.valid;
    }
}

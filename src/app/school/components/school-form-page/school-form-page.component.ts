import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ICity } from '@portal/shared/models/city.model';
import { ICountry } from '@portal/shared/models/country.model';
import { LocationService } from '@portal/shared/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-school-form-page',
    templateUrl: './school-form-page.component.html',
    styleUrls: ['./school-form-page.component.scss']
})
export class SchoolFormPageComponent extends ComponentBase {
    form: FormGroup | undefined;
    school: ISchool | undefined;
    canteen: ICanteen | undefined;
    countries: ICountry[] = [];
    cities: ICity[] = [];
    isLoading: boolean = true;
    isEditing: boolean = false;

    constructor(
        private schoolService: SchoolService,
        private locationService: LocationService,
        private canteenService: CanteenService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        super();

        const id = this.route.snapshot.params.id;

        if (id) {
            this.getSchool(id);
            this.isEditing = true;
        } else {
            this.form = this.createForm();
            this.isEditing = false;
            this.isLoading = false;
        }

        this.getCountries().pipe(takeUntil(this.destroyed$)).subscribe();
    }

    getRequiredData = (schoolId: string) => {
        forkJoin([this.getSchool(schoolId), this.getCountries()])
            .pipe(
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    getSchool = (schoolId: string) => {
        this.schoolService
            .getSchool(schoolId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.school) {
                        this.school = result.school;
                        this.form = this.createForm(this.school);

                        if (result.school.canteens && result.school.canteens.length) {
                            this.lookupCanteen(result.school.canteens[0].canteenId);
                        }
                    } else {
                        this.toastr.error('Failed to retrieve school', 'Get School');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.isLoading = false;
                    this.toastr.error('Failed to retrieve school', 'Get School');
                    return of();
                })
            )
            .subscribe();
    };

    lookupCanteen = (canteenId?: string) => {
        const id = canteenId || this.form?.getRawValue().canteens.canteenId;
        this.canteen = undefined;

        this.canteenService
            .lookupCanteen(id)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.canteen) {
                        this.canteen = result.canteen;
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLoading = false;
                    return of();
                })
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
            catchError((error) => {
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

    createForm = (school?: ISchool) => {
        const form = this.fb.group({
            address: [school?.address || '', [Validators.required]],
            canteens: this.fb.group({
                canteenId: [school?.canteens[0]?.canteenId || '', [Validators.required]],
                canteenName: [{ value: school?.canteens[0]?.canteenName || '', disabled: true }],
                canteenMobile: [{ value: '', disabled: true }],
                canteenPhoneNo: [{ value: '', disabled: true }]
            }),
            city: ['', [Validators.required]],
            country: ['', [Validators.required]],
            currentAttendanceSubscriptionEnds: [
                {
                    value: GetDisplayDate(
                        new Date(
                            school?.currentAttendanceSubscriptionEnds || new Date().setMonth(new Date().getMonth() + 4)
                        )
                    ),
                    disabled: true
                }
            ],
            currentAttendanceSubscriptionStarts: [
                {
                    value: GetDisplayDate(new Date(school?.currentAttendanceSubscriptionStarts || new Date())),
                    disabled: true
                }
            ],
            email: [school?.email || '', [Validators.required, Validators.email]],
            mobileNo: [school?.mobileNo || '', [Validators.required]],
            phone: [school?.phone || '', [Validators.required]],
            schoolRegistrationCode: [school?.schoolRegistrationCode || '', [Validators.required]],
            translations: this.fb.group({
                en: [school?.translations?.en || '', [Validators.required]],
                ar: [school?.translations?.ar || '', [Validators.required]]
            }),
            officialNameTranslations: this.fb.group({
                en: [school?.officialNameTranslations?.en || '', [Validators.required]],
                ar: [school?.officialNameTranslations?.ar || '', [Validators.required]]
            }),
            vat: [school?.vat || '', [Validators.required]],
            studentCount: [{ value: school?.noOfStudents || 0, disabled: true }],
            streetAddress: this.fb.group({
                unitNo: [school?.streetAddress?.unitNo || '', [Validators.required]],
                buildingNo: [school?.streetAddress?.buildingNo || '', [Validators.required]],
                street: [school?.streetAddress?.street || '', [Validators.required]],
                district: [school?.streetAddress?.district || '', [Validators.required]],
                city: [school?.streetAddress?.city || '', [Validators.required]],
                zipCode: [school?.streetAddress?.zipCode || '', [Validators.required]],
                country: [school?.streetAddress?.country || '', [Validators.required]],
                additional: [school?.streetAddress?.additional || '', [Validators.required]]
            }),
            schoolType: this.fb.group({
                public: [this.school?.schoolType?.public || false, [Validators.required]],
                national: [this.school?.schoolType?.national || false, [Validators.required]],
                international: [this.school?.schoolType?.international || false, [Validators.required]],
                quranic: [this.school?.schoolType?.quranic || false, [Validators.required]],
                technical: [this.school?.schoolType?.technical || false, [Validators.required]]
            }),
            schoolLevel: this.fb.group({
                nursery: [this.school?.schoolLevel?.nursery || false, [Validators.required]],
                kindergarten: [this.school?.schoolLevel?.kindergarten || false, [Validators.required]],
                elementary: [this.school?.schoolLevel?.elementary || false, [Validators.required]],
                intermediate: [this.school?.schoolLevel?.intermediate || false, [Validators.required]],
                secondary: [this.school?.schoolLevel?.secondary || false, [Validators.required]]
            })
        });

        const canteenFormArray = form.get('canteens') as FormArray;

        canteenFormArray
            .get('canteenId')
            ?.valueChanges.pipe(
                tap(() => {
                    this.canteen = undefined;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();

        return form;
    };

    map = () => {
        const formValue = this.form?.getRawValue();

        if (!formValue) {
            return;
        }

        let school: any = {
            address: formValue.address,
            canteens: [this.canteen?._id],
            city: formValue.city,
            country: formValue.country,
            email: formValue.email,
            phone: formValue.phone,
            mobileNo: formValue.mobileNo,
            schoolName: formValue.translations.en,
            schoolRegistrationCode: formValue.schoolRegistrationCode,
            translations: formValue.translations,
            officialNameTranslations: formValue.officialNameTranslations,
            vat: formValue.vat,
            streetAddress: {
                unitNo: formValue.streetAddress.unitNo,
                buildingNo: formValue.streetAddress.buildingNo,
                street: formValue.streetAddress.street,
                district: formValue.streetAddress.district,
                city: formValue.streetAddress.city,
                zipCode: formValue.streetAddress.zipCode,
                country: formValue.streetAddress.country,
                additional: formValue.streetAddress.additional
            },
            schoolType: formValue.schoolType,
            schoolLevel: formValue.schoolLevel,
        };

        if (!this.isEditing) {
            school = {
                ...school,
                schoolName: formValue.translations.en,
                currentSubscriptionEnds: new Date(formValue.currentAttendanceSubscriptionEnds),
                currentSubscriptionStarts: new Date(formValue.currentAttendanceSubscriptionStarts)
            };
        }

        return school;
    };

    save = () => {
        if (!this.form?.valid || !this.canteen) {
            return;
        }

        this.isLoading = true;

        const school = this.map();

        const obs = this.isEditing ? this.patchSchool(this.school!._id, school) : this.createSchool(school);

        obs.pipe(
            tap((result) => {
                if (result.success) {
                    this.toastr.success('School save successful', 'Save School');
                    this.goToSchoolList();
                } else {
                    this.toastr.error('Save school failed', 'Save School');
                    this.isLoading = false;
                }
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.isLoading = false;
                this.toastr.error('Save school failed', 'Save School');
                return of();
            })
        ).subscribe();
    };

    createSchool = (school: ISchool) => {
        return this.schoolService.createSchool(school);
    };

    patchSchool = (id: string, school: ISchool) => {
        return this.schoolService.patchSchool(id, school);
    };

    goToSchoolList = () => {
        this.router.navigate(['/schools']);
    };

    get shouldDisableSaveButton() {
        return !this.form?.valid || this.isLoading || !this.canteen;
    }
}

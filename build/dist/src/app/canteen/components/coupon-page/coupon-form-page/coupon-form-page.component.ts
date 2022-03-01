import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { CouponStatuses, ICoupon } from '@portal/canteen/models/coupon.model';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-form-page',
    templateUrl: './coupon-form-page.component.html',
    styleUrls: ['./coupon-form-page.component.scss']
})
export class CouponFormPageComponent extends ComponentBase {
    form: FormGroup | undefined;
    currentUserRoles: string[] = [];
    coupon: ICoupon | undefined;
    schools: ISchool[] = [];
    isLoading: boolean = true;
    isEditing: boolean = true;
    schoolOptions: any = [];

    constructor(
        private authService: AuthService,
        private couponService: CouponService,
        private schoolService: SchoolService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        super();
        this.currentUserRoles = this.authService.userRoles();
        const id = this.route.snapshot.params.id;

        if (id) {
            this.getCoupon(id);
            this.isEditing = true;
        } else {
            this.getSchools();
            this.createForm();
            this.isEditing = false;
            this.isLoading = false;
        }
    }

    getCoupon = (id: string) => {
        this.couponService
            .getCoupon(id)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.coupon = result.coupon;
                        this.getSchools();
                        this.createForm(this.coupon);
                    }

                    if (!result.success) {
                        this.toastr.error('Failed to retrieve coupon', 'Coupon');
                        this.goToCouponList();
                    }

                    this.isLoading = false;
                }),
                catchError(() => {
                    this.toastr.error('Failed to retrieve coupon', 'Coupon');
                    return of();
                })
            )
            .subscribe();
    };

    getSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.schools = result.schools || [];
                        this.schoolOptions = selectOptions(this.schools)
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    createForm = (coupon?: ICoupon) => {
        this.form = this.fb.group({
            forSpecificSchools: [coupon?.forSpecificSchools || false, [Validators.required]],
            onlyForSchools: [coupon?.onlyForSchools || []],
            redeemForOnlineOrder: [coupon?.redeemForOnlineOrder || false, [Validators.required]],
            redeemForWalkinOrder: [coupon?.redeemForWalkinOrder || false, [Validators.required]],
            status: [coupon?.status || null],
            couponName: [coupon?.couponName || ''],
            creditAvail: [coupon?.creditAvail || 0, [Validators.required, Validators.min(0)]],
            saveAmount: [{ value: coupon?.saveAmount || 0, disabled: true }, [Validators.required, Validators.min(0)]],
            couponPrice: [coupon?.couponPrice || 0, [Validators.required, Validators.min(0)]],
            validityInDays: [coupon?.validityInDays || 90, [Validators.required]],
            translations: this.fb.group({
                en: [coupon?.translations?.en || '', [Validators.required]],
                ar: [coupon?.translations?.ar || '', [Validators.required]]
            })
        });
    };

    map = () => {
        const formValues = this.form?.getRawValue();

        const coupon: any = {
            forSpecificSchools: formValues.forSpecificSchools,
            onlyForSchools: [],
            redeemForOnlineOrder: formValues.redeemForOnlineOrder,
            redeemForWalkinOrder: formValues.redeemForWalkinOrder,
            couponName: formValues.couponName || formValues.translations.en,
            creditAvail: formValues.creditAvail,
            saveAmount: formValues.saveAmount,
            couponPrice: formValues.couponPrice,
            validityInDays: formValues.validityInDays,
            translations: {
                en: formValues.translations?.en,
                ar: formValues.translations?.ar
            }
        };

        if (coupon.forSpecificSchools) {
            coupon.onlyForSchools = formValues.onlyForSchools;
        }

        return coupon;
    };

    save = () => {
        if (!this.form!.valid) {
            return;
        }

        this.isLoading = true;
        const coupon = this.map();

        const obs = this.isEditing ? this.patchCoupon(this.coupon?._id || '', coupon) : this.createCoupon(coupon);

        obs.pipe(
            tap((result) => {
                if (result.success) {
                    this.toastr.success('Coupon Saved', 'Coupon');
                    this.goToCouponList();
                }

                this.isLoading = false;
            }),
            takeUntil(this.destroyed$),
            catchError(() => {
                this.toastr.error('Failed to Save Coupon', 'Coupon');
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    createCoupon = (coupon: ICoupon) => {
        return this.couponService.createCoupon(coupon);
    };

    patchCoupon = (id: string, coupon: ICoupon) => {
        return this.couponService.patchCoupon(id, coupon);
    };

    goToCouponList = () => {
        this.router.navigate(['/canteens/coupons']);
    };

    get shouldDisableSaveButton() {
        return !this.form?.valid;
    }
}

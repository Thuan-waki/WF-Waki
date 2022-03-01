import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICoupon } from '@portal/canteen/models/coupon.model';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-approve-dialog',
    templateUrl: './coupon-approve-dialog.component.html',
    styleUrls: ['./coupon-approve-dialog.component.scss']
})
export class CouponApproveDialogComponent extends ComponentBase {
    @Input() coupon!: ICoupon;

    form: FormGroup = this.fb.group({
        fee: [0, [Validators.required]]
    });

    isLoading = false;

    constructor(
        private couponService: CouponService,
        private activeModal: NgbActiveModal,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {
        super();
    }

    close = () => {
        this.activeModal.close();
    };

    approve = () => {
        if (!this.form.valid) {
            return;
        }

        this.isLoading = true;
        this.couponService
            .approveCoupon(this.coupon?._id, this.form.get('fee')?.value)
            .pipe(
                tap((result: IApiResult) => {
                    this.activeModal.close(true);
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error('Faled to approve Coupon', 'Coupon');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    get shouldDisableApproveButton() {
        return !this.form.valid;
    }
}

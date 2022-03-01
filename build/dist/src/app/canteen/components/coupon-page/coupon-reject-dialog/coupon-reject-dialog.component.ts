import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICoupon } from '@portal/canteen/models/coupon.model';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-reject-dialog',
    templateUrl: './coupon-reject-dialog.component.html',
    styleUrls: ['./coupon-reject-dialog.component.scss']
})
export class CouponRejectDialogComponent extends ComponentBase {
    @Input() coupon!: ICoupon;

    isLoading = false;

    constructor(
        private couponService: CouponService,
        private activeModal: NgbActiveModal,
        private toastr: ToastrService
    ) {
        super();
    }

    close = () => {
        this.activeModal.close();
    };

    reject = () => {
        this.isLoading = true;
        this.couponService
            .rejectCoupon(this.coupon?._id)
            .pipe(
                tap((result: IApiResult) => {
                    this.activeModal.close(true);
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error('Faled to reject Coupon', 'Coupon');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };
}

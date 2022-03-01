import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultCouponFilter, ICoupon, ICouponFilter } from '@portal/canteen/models/coupon.model';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { CouponApproveDialogComponent } from '../../coupon-approve-dialog/coupon-approve-dialog.component';
import { CouponRejectDialogComponent } from '../../coupon-reject-dialog/coupon-reject-dialog.component';

@Component({
    selector: 'app-coupon-list',
    templateUrl: './coupon-list.component.html',
    styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent extends ComponentBase {
    @Input() coupons: ICoupon[] = [];
    @Input() currentUserRoles: string[] = [];
    @Input() canteenOptions: any[] = [];
    @Input() isAdmin = false;
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultCouponFilter.limit || 50;
    @Output() filter = new EventEmitter<ICouponFilter>();
    @Output() export = new EventEmitter();
    @Output() newCoupon = new EventEmitter();
    @Output() editCoupon = new EventEmitter<string>();

    userRoles = UserRoles;
    form: FormGroup = this.fb.group({
        search: [''],
        canteen: [null]
    });
    currentPage = 1;

    constructor(
        private couponService: CouponService,
        private fb: FormBuilder,
        public modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router
    ) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: ICouponFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            canteen: formValue.canteen
        };

        this.filter.emit(filterValues);
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    approve = (coupon: ICoupon) => {
        const modalRef = this.modalService.open(CouponApproveDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.coupon = coupon;

        modalRef.result
            .then((res) => {
                if (res) {
                    this.toastr.success('Coupon Approved', 'Coupon');
                    this.filterRecord();
                }
            })
            .catch();
    };

    reject = (coupon: ICoupon) => {
        const modalRef = this.modalService.open(CouponRejectDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.coupon = coupon;

        modalRef.result
            .then((res) => {
                if (res) {
                    this.toastr.success('Coupon Rejected', 'Coupon');
                    this.filterRecord();
                }
            })
            .catch();
    };

    publishOrUnpublish = (coupon: ICoupon) => {
        this.isLoading = true;
        this.couponService
            .publishOrUnpublishCoupon(coupon._id, !coupon.isPublished)
            .pipe(
                tap(() => {
                    this.toastr.info(`Coupon ${coupon.isPublished ? 'Unpublished' : 'Published'}`, 'Coupon');
                    coupon.isPublished = !coupon.isPublished;
                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error(`Failed to ${coupon.isPublished ? 'Unpublish' : 'Publish'} coupone`, 'Coupon');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    goToCouponOrder = (couponId: string) => {
        this.router.navigateByUrl(`/canteens/coupons/order?coupon=${couponId}`);
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

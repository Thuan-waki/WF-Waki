import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultCouponFilter, ICoupon, ICouponFilter } from '@portal/canteen/models/coupon.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { CouponStatusPipe } from '@portal/shared/pipes/coupon-status.pipe';
import { YesNoBooleanPipe } from '@portal/shared/pipes/yes-no-boolean.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-list-page',
    templateUrl: './coupon-list-page.component.html',
    styleUrls: ['./coupon-list-page.component.scss']
})
export class CouponListPageComponent extends ComponentBase {
    coupons: ICoupon[] = [];
    currentUserRoles: string[] = [];
    canteenOptions: any[] = [];
    isAdmin: boolean = false;
    isLoading: boolean = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultCouponFilter.limit || 50;

    constructor(
        private authService: AuthService,
        private couponService: CouponService,
        private canteenService: CanteenService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private yesNoBooleanPipe: YesNoBooleanPipe,
        private couponStatusPipe: CouponStatusPipe,
        private router: Router,
        private utilitiesService: UtilitiesService
    ) {
        super();

        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        this.currentUserRoles = this.authService.userRoles();
        this.getCoupons();

        if (this.isAdmin) {
            this.getCanteens();
        }
    }

    getCoupons = (filter?: ICouponFilter) => {
        this.isLoading = true;
        this.couponService
            .getCoupons(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.coupons = result.body?.coupons || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to fetch coupons', 'Coupons');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to fetch coupons', 'Coupons');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    getCanteens = () => {
        this.canteenService
            .getSelectCanteens(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.canteenOptions = selectOptions(result.canteens || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    newCoupon = () => {
        this.router.navigate(['/canteens/coupons/form']);
    };

    editCoupon = (id: string) => {
        this.router.navigate([`/canteens/coupons/form/${id}`]);
    };

    exportToExcel = () => {
        const rows = this.coupons.map((row) => {
            const r: any = {};

            r['Coupon Name'] = row.couponName;
            r['For Specific Schools'] = this.yesNoBooleanPipe.transform(row.forSpecificSchools);
            r['Uses'] = `${row.redeemForOnlineOrder || ''} ${row.redeemForWalkinOrder || ''}` || '';
            r['Total Credit'] = row.creditAvail || '';
            r['Save'] = row.saveAmount || '';
            r['Cost'] = row.couponPrice || '';
            r['Period'] = `${row.validityInDays} days`;
            r['Fee'] = row.wakiFeePercentage || '';
            r['No. Of Uses'] = row.noOfRedeemed || '';
            r['Status'] = this.couponStatusPipe.transform(row.status);
            r['Published'] = this.yesNoBooleanPipe.transform(row.isPublished);

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Students`));
    };
}

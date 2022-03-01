import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { defaultCouponOrderFilter, ICouponOrder, ICouponOrderFilter } from '@portal/canteen/models/coupon-order.model';
import { defaultCouponFilter, ICoupon } from '@portal/canteen/models/coupon.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { CouponService } from '@portal/canteen/services/coupon.service';
import { InvoiceService } from '@portal/canteen/services/invoice.service';
import { ISchool } from '@portal/school/models/school.model';
import { IStudent } from '@portal/school/models/student.model';
import { SchoolService } from '@portal/school/services/school.service';
import { StudentService } from '@portal/school/services/student.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-order-list-page',
    templateUrl: './coupon-order-list-page.component.html',
    styleUrls: ['./coupon-order-list-page.component.scss']
})
export class CouponOrderListPageComponent extends ComponentBase {
    couponOrders: ICouponOrder[] = [];
    schoolOptions: ISelectOption[] = [];
    canteenOptions: ISelectOption[] = [];
    studentOptions: ISelectOption[] = [];
    couponOptions: ISelectOption[] = [];
    couponId: string = '';
    isLoading = true;
    isAdmin = false;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultCouponFilter.limit || 50;
    defaultCouponOrderFilter = defaultCouponOrderFilter;

    constructor(
        private couponService: CouponService,
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private studentService: StudentService,
        private authService: AuthService,
        private wakiDatePipe: WakiDatePipe,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private utilitiesService: UtilitiesService,
        private invoiceService: InvoiceService,
        private route: ActivatedRoute
    ) {
        super();

        const couponFilter = this.route.snapshot.queryParams.coupon;
        if (couponFilter) {
            this.defaultCouponOrderFilter.coupon = couponFilter;
        }

        this.isAdmin = this.authService.isAdminOrSuperAdmin();

        this.getCouponOrders();

        if (this.isAdmin) {
            this.getSchools();
            this.getCanteens();
            this.getStudents();
            this.getCoupons();
        }
    }

    getCouponOrders = (filter?: ICouponOrderFilter) => {
        this.isLoading = true;
        this.couponOrders = [];

        this.couponService
            .getCouponOrders(filter || this.defaultCouponOrderFilter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.couponOrders = result.body?.couponOrders || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Coupon Orders Missing', 'Coupon Order');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to load coupon orders', 'Coupon Order');
                    this.isLoading = false;
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
                        this.schoolOptions = selectOptions(result.schools || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
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

    getStudents = () => {
        this.studentService
            .getSelectStudents(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.studentOptions = selectOptions(result.students || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getCoupons = () => {
        this.couponService
            .getSelectCoupons(['id', 'couponName'])
            .pipe(
                tap((res) => {
                    if (res.success) {
                        this.couponOptions = selectOptions(res.coupons || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getDateAndTime = (date: Date) => {
        const dateAndTime = this.wakiDatePipe.transform(date, true)?.split(' ');

        return {
            date: dateAndTime[0] || '',
            time: `${dateAndTime[1]} ${dateAndTime[2]}` || ''
        };
    };

    email = (invoiceNo: string) => {
        this.invoiceService
            .email(invoiceNo || '')
            .pipe(
                tap(() => {
                    this.toastr.success('Email Sent', 'Email');
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to send email', 'Email Invoice');
                    return of();
                })
            )
            .subscribe();
    };

    download = (invoiceNo: string) => {
        this.invoiceService
            .getInvoice(invoiceNo || '')
            .pipe(
                tap((res: Blob) => {
                    const downloadUrl = window.URL.createObjectURL(res);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${invoiceNo}.pdf`;
                    link.click();
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to download invoice', 'Invoice Download');
                    return of();
                })
            )
            .subscribe();
    };

    exportToExcel = () => {
        const rows = this.couponOrders.map((row) => {
            const r: any = {};
            const trDateTime = this.getDateAndTime(row.orderDate);

            r['Transaction ID'] = row.orderId;
            r['Date'] = trDateTime.date;
            r['Time'] = trDateTime.time;
            r['Adult (English)'] = row.orderedByParent?.translations?.en || '';
            r['Adult (Arabic)'] = row.orderedByParent?.translations?.ar || '';
            r['Dependent (English)'] = row.student?.translations?.en || '';
            r['Dependent (Arabic)'] = row.student?.translations?.ar || '';
            r['Subtotal'] = row.subTotal || 0;
            r['VAT'] = row.vatAmount || 0;
            r['Amount'] = row.totalAmount || 0;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Coupon Orders`));
    };
}

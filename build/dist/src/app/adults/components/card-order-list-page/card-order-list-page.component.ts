import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { defaultCardOrderFilter, ICardOrderFilter } from '@portal/adults/models/card-order-filter.model';
import { ICardOrder } from '@portal/adults/models/card-order.model';
import { CardOrderService } from '@portal/adults/services/card-order.service';
import { AuthService } from '@portal/auth/services/auth.service';
import { InvoiceService } from '@portal/canteen/services/invoice.service';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-card-order-list-page',
    templateUrl: './card-order-list-page.component.html',
    styleUrls: ['./card-order-list-page.component.scss']
})
export class CardOrderListPageComponent extends ComponentBase implements OnInit {
    canteenId: string = '';
    cardOrders: ICardOrder[] = [];
    schoolOptions: ISelectOption[] = [];
    isLoading = true;
    isAdmin = false;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultCardOrderFilter.limit || 50;

    constructor(
        private cardOrderService: CardOrderService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private invoiceService: InvoiceService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe
    ) {
        super();
        this.canteenId = this.authService.getUserCanteenId();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();

        if (this.isAdmin) {
            this.getSelectSchools();
        }
    }

    ngOnInit(): void {
        this.getCardOrders(defaultCardOrderFilter);
    }

    getSelectSchools = () => {
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

    getCardOrders = (filter: ICardOrderFilter) => {
        this.isLoading = true;
        this.cardOrders = [];

        this.cardOrderService
            .getCardOrders(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.cardOrders = result.body?.cardOrders || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve card orders', 'Card Order');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to load card orders', 'Card Order');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
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
        const rows = this.cardOrders.map((row) => {
            const r: any = {};

            r['CID'] = row.orderId || '';
            r['Order Date'] = this.wakiDatePipe.transform(row.orderDate);
            r['Theme'] = row.cardColor || '';
            r['Card Holder Name'] = translationLang(row.forUser?.translations);
            r['Card Holder ID'] = row.forUser?.nationalId || '';
            r['Adult'] = translationLang(row.orderedByParent?.translations);
            r['Adult ID'] = row.orderedByParent?.nationalId || '';
            r['School'] = translationLang(row.school?.translations);
            r['VAT'] = row.vatAmount;
            r['Total Amount'] = row.totalAmount;
            r['Status'] = row.orderStatus === 'DELIVERED' ? 'Delivered' : 'Pending';

            return r;
        });

        this.excelExportService.exportExcel(rows, `Card Orders`);
    };
}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { InvoiceService } from '@portal/canteen/services/invoice.service';
import { defaultFeeFilter, IFee, IFeeFilter } from '@portal/fee/models/fee.model';
import { FeeService } from '@portal/fee/services/fee.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-fee-list-page',
    templateUrl: './fee-list-page.component.html',
    styleUrls: ['./fee-list-page.component.scss']
})
export class FeeListPageComponent extends ComponentBase implements OnInit {
    fees: IFee[] | undefined;
    fees$ = new Observable<IFee[]>();
    pageEvent$ = new BehaviorSubject<IFeeFilter>(defaultFeeFilter);
    isLoading: boolean = true;
    filter: IFeeFilter = defaultFeeFilter;
    isAdmin = false;
    isCanteenUser = false;
    canteenId: string = '';
    canteenOptions: ISelectOption[] = [];
    selectedCanteenId: string = '';
    recordCount: number = 0;
    maxPage: number = 0;
    pageSize: number = defaultFeeFilter.limit || 50;

    constructor(
        private feeService: FeeService,
        private invoiceService: InvoiceService,
        private canteenService: CanteenService,
        private authService: AuthService,
        private toastr: ToastrService
    ) {
        super();

        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        this.isCanteenUser = this.authService.isCanteenUser() || this.authService.isSuperCanteenUser();
        this.canteenId = this.authService.getUserCanteenId();
    }

    ngOnInit(): void {
        if (this.isAdmin) {
            this.getCanteens();
        } else {
            this.getFees({ ...this.filter, canteen: this.canteenId });
        }
    }

    getFees = (filter: IFeeFilter) => {
        this.isLoading = true;
        this.fees = [];
        this.selectedCanteenId = filter.canteen || '';

        this.feeService
            .getFees(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.fees = result.body.fees || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve fees', 'Fees');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve fees', 'Fees');
                    this.isLoading = false;
                    return of<IFee[]>();
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

    getCanteens = () => {
        this.canteenService
            .getSelectCanteens(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.canteenOptions = selectOptions(result.canteens || []);
                        this.canteenId = this.canteenOptions[0]?.value;
                        this.getFees({ ...defaultFeeFilter, canteen: this.canteenId });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };
}

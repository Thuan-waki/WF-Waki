import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RefundRequestService } from '@portal/adults/services/refund-request.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { defaultRefundRequestFilter, IRequestFilter } from '@portal/shared/models/request-filter.model';
import { IRequest } from '@portal/shared/models/request.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-refund-request-list-page',
    templateUrl: './refund-request-list-page.component.html',
    styleUrls: ['./refund-request-list-page.component.scss']
})
export class RefundRequestListPageComponent extends ComponentBase implements OnInit {
    refundRequests: IRequest[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultRefundRequestFilter.limit || 50;

    constructor(
        private refundRequestService: RefundRequestService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe
    ) {
        super();
    }

    ngOnInit(): void {
        this.getRefundRequests(defaultRefundRequestFilter);
    }

    getRefundRequests = (filter: IRequestFilter) => {
        this.isLoading = true;
        this.refundRequests = [];

        this.refundRequestService
            .getRefundRequest(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.refundRequests = result.body?.requests || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve refund requests', 'Refund Request');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve refund requests', 'Refund Request');
                    this.isLoading = false;
                    return of();
                })
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

    exportToExcel = () => {
        const rows = this.refundRequests.map((row) => {
            const r: any = {};

            r['RPID'] = row.requestId;
            r['Date'] = this.getDateAndTime(row.rqDate).date;
            r['Time'] = this.getDateAndTime(row.rqDate).time;
            r['Amount'] = row.amount || 0;
            r['Type'] = 'Parent Refund';
            r['Bank Name (English)'] = row.trAccount?.bank?.translations?.en;
            r['Bank Name (Arabic)'] = row.trAccount?.bank?.translations?.ar;
            r['Account Name'] = row.trAccount?.accountName;
            r['Account Number'] = row.trAccount?.accountNo || '';
            r['IBAN'] = row.trAccount?.IBAN || '';
            r['Status'] = row.rqStatus;

            return r;
        });

        this.excelExportService.exportExcel(rows, `Refund Requests`);
    };
}

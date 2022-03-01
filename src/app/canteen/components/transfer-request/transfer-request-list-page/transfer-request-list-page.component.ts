import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultTransferRequestFilter, IRequestFilter } from '@portal/shared/models/request-filter.model';
import { TransferRequestService } from '@portal/canteen/services/transfer-request.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { IRequest } from '@portal/shared/models/request.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { translationLang } from '@portal/shared/functions/translate-language';

@Component({
    selector: 'app-transfer-request-list-page',
    templateUrl: './transfer-request-list-page.component.html',
    styleUrls: ['./transfer-request-list-page.component.scss']
})
export class TransferRequestListPageComponent extends ComponentBase implements OnInit {
    canteenId: string = '';
    transferRequests: IRequest[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultTransferRequestFilter.limit || 50;
    isAdmin = false;

    constructor(
        private transferRequestService: TransferRequestService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe,
        private utilitiesService: UtilitiesService
    ) {
        super();
        this.canteenId = this.authService.getUserCanteenId();
        this.isAdmin = this.authService.doesHaveRoles([UserRoles.WAKI_SUPER_ADMIN, UserRoles.WAKI_ADMIN]);
    }

    ngOnInit(): void {
        this.getTransferRequests(defaultTransferRequestFilter);
    }

    getTransferRequests = (filter: IRequestFilter) => {
        if (!filter.canteen || !filter.canteen.length) {
            filter.canteen = this.canteenId;
        }

        this.isLoading = true;
        this.transferRequests = [];

        this.transferRequestService
            .getTransferRequests(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.transferRequests = result.body?.requests || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Food Orders Missing', 'Food Order');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to load transfer requests', 'Transfer Request');
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
        const rows = this.transferRequests.map((row) => {
            const r: any = {};

            r['Request ID'] = row.requestId;
            r['Date'] = this.getDateAndTime(row.rqDate).date;
            r['Time'] = this.getDateAndTime(row.rqDate).time;
            r['Canteen Bank Name'] = translationLang(row.canteen?.bankAccount?.bank?.translations);
            r['Canteen Account Number'] = row.canteen?.bankAccount?.accountNo || '';
            r['IBAN'] = row.canteen?.bankAccount?.IBAN || '';
            r['Amount'] = row.amount || 0;
            r['Canteen Name (EN)'] = row.canteen?.translations?.en || '';
            r['Canteen Name (AR)'] = row.canteen?.translations?.ar || '';
            r['Bank Account Name'] = row.canteen?.bankAccount?.accountName || '';
            r['Canteen Address'] = row.canteen?.address || '';
            r['Status'] = row.rqStatus;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Transfer_Request`));
    };
}

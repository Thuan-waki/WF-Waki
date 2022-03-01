import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ParentService } from '@portal/adults/services/parent.service';
import { defaultAdultTransactionFilter, ITransactionFilter } from '@portal/canteen/models/transaction-filter.model';
import { TransactionTypes } from '@portal/canteen/models/transaction-types';
import { ITransaction } from '@portal/canteen/models/transaction.model';
import { TransactionService } from '@portal/canteen/services/transactions.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { COMPANY_NAME, WAKI_VAT, X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { PurposeOfRefundPipe } from '@portal/shared/pipes/purpose-of-refund.pipe';
import { PurposeOfTransferPipe } from '@portal/shared/pipes/purpose-of-transfer.pipe';
import { TransactionTypePipe } from '@portal/shared/pipes/transaction-type.pipe';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-adult-transaction-list-page',
    templateUrl: './adult-transaction-list-page.component.html',
    styleUrls: ['./adult-transaction-list-page.component.scss']
})
export class AdultTransactionListPageComponent extends ComponentBase {
    transactions: ITransaction[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultAdultTransactionFilter.limit || 50;
    adultOptions: any[] = [];

    constructor(
        private transactionService: TransactionService,
        private parentService: ParentService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe,
        private transactionTypePipe: TransactionTypePipe,
        private purposeOfRefundPipe: PurposeOfRefundPipe,
        private purposeOfTransferPipe: PurposeOfTransferPipe
    ) {
        super();

        this.getTransactions(defaultAdultTransactionFilter);
        this.getAdults();
    }

    getTransactions = (filter: ITransactionFilter) => {
        this.isLoading = true;
        this.transactions = [];

        this.transactionService
            .getTransactions(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.transactions = result.body?.transactions || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve transactions', 'Transactions');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to retrieve transactions', 'Transactions');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    getAdults = () => {
        this.parentService
            .getSelectParents(['id', 'user', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.parents?.length) {
                        this.adultOptions = result.parents.map((parent) => {
                            return {
                                label: translationLang(parent.user?.translations),
                                value: parent._id
                            };
                        });
                    }
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

    generateFromText = (transaction: ITransaction) => {
        if (transaction.trType === TransactionTypes.ReturnOrder) {
            return translationLang(transaction.to?.translations);
        }

        if (transaction.trType !== TransactionTypes.TransferToCanteen && transaction.trType !== TransactionTypes.VAT) {
            return translationLang(transaction.from?.translations);
        }

        return '';
    };

    generateToText = (transaction: ITransaction) => {
        if (transaction.trType === TransactionTypes.TransferBetweenUsers) {
            return translationLang(transaction.to?.translations);
        }

        if (transaction.trType === TransactionTypes.Refund) {
            return translationLang(transaction.toBankAccount?.bank?.translations);
        }

        if (transaction.trType === TransactionTypes.Fund) {
            return transaction.externalPaymentObject?.source?.type;
        }

        if (transaction.trType === TransactionTypes.WalkInOrder) {
            return translationLang(transaction.to?.translations);
        }

        if (transaction.trType === TransactionTypes.ReturnOrder) {
            return translationLang(transaction.foodOrderId?.student?.translations);
        }

        return translationLang(transaction.student?.translations);
    };

    getTransactionDescriptionText = (transaction: ITransaction) => {
        if (transaction.trType === TransactionTypes.Fund) {
            return transaction.externalPaymentObject?.source?.number;
        }

        if (transaction.trType === TransactionTypes.TransferBetweenUsers) {
            return this.purposeOfTransferPipe.transform(transaction.purposeOfTransfer);
        }

        if (transaction.trType === TransactionTypes.Refund) {
            return this.purposeOfRefundPipe.transform(transaction.purposeOfRefund);
        }

        if (transaction.trType === TransactionTypes.AppOrder) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.WalkInOrder) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.ReturnOrder) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.CardOrder) {
            return `<span>${COMPANY_NAME}</span><span>3830 Wadi As Safa Street, Alaziziyah Dist, Jeddah</span>`;
        }

        if (transaction.trType === TransactionTypes.CouponPurchase) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.ADULT_VAT) {
            return `<span>${COMPANY_NAME}</span><span>${WAKI_VAT}</span>`;
        }

        return '';
    };

    exportToExcel = () => {
        const rows = this.transactions.map((row) => {
            const r: any = {};

            r['Transaction ID'] = row.transactionId;
            r['Date'] = this.getDateAndTime(row.trDate).date;
            r['Time'] = this.getDateAndTime(row.trDate).time;
            r['Transaction Type'] = this.transactionTypePipe.transform(row.trType);
            r['Description'] = this.removeSpanTag(this.getTransactionDescriptionText(row) || '');
            r['From'] = this.generateFromText(row);
            r['To'] = this.removeSpanTag(this.generateToText(row) || '');
            r['Amount'] = row.amount || 0;
            r['balance'] = row.balance || 0;

            return r;
        });

        this.excelExportService.exportExcel(rows, `Adult_Transactions`);
    };

    removeSpanTag = (text: string) => {
        if (!text || !text.length) {
            return '';
        }

        let removed = text.replace('</span><span>', ', ');
        removed = removed.replace('<span>', '');

        return removed.replace('</span>', '');
    };
}

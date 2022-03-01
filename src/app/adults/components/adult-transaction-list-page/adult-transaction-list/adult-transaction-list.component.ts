import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IParent } from '@portal/adults/models/parent.model';
import { AppComponent } from '@portal/app.component';
import {
    defaultAdultTransactionFilter,
    defaultTransactionFilter,
    ITransactionFilter
} from '@portal/canteen/models/transaction-filter.model';
import { TransactionTypes } from '@portal/canteen/models/transaction-types';
import { ITransaction } from '@portal/canteen/models/transaction.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { COMPANY_NAME, WAKI_VAT } from '@portal/shared/constants/common.constants';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { PaymentPipe } from '@portal/shared/pipes/payment.pipe';
import { PurposeOfRefundPipe } from '@portal/shared/pipes/purpose-of-refund.pipe';
import { PurposeOfTransferPipe } from '@portal/shared/pipes/purpose-of-transfer.pipe';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-adult-transaction-list',
    templateUrl: './adult-transaction-list.component.html',
    styleUrls: ['./adult-transaction-list.component.scss']
})
export class AdultTransactionListComponent extends ComponentBase {
    @Input() transactions: ITransaction[] = [];
    @Input() adultOptions: any = [];
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultAdultTransactionFilter.limit || 50;
    @Output() filter = new EventEmitter<ITransactionFilter>();
    @Output() export = new EventEmitter();

    form = this.fb.group({
        fromDate: [GetDisplayDate(defaultTransactionFilter.fromDate)],
        toDate: [GetDisplayDate(defaultTransactionFilter.toDate)],
        search: [null],
        adult: [null]
    });
    currentPage = 1;
    typeFilter: string[] = [];
    transactionTypes = TransactionTypes;

    constructor(
        private fb: FormBuilder,
        private wakiDatePipe: WakiDatePipe,
        private purposeOfRefundPipe: PurposeOfRefundPipe,
        private purposeOfTransferPipe: PurposeOfTransferPipe,
        private paymentPipe: PaymentPipe
    ) {
        super();

        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const types = this.typeFilter.length
            ? this.typeFilter.map((c) => <TransactionTypes>c).join(',')
            : defaultAdultTransactionFilter.trType;

        const filterValues: ITransactionFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate),
            trType: types,
            school: '',
            parent: formValue.adult,
            userType: 'adult'
        };

        this.filter.emit(filterValues);
    };

    getDateAndTime = (date: Date) => {
        const dateAndTime = this.wakiDatePipe.transform(date, true)?.split(' ');

        return {
            date: dateAndTime[0] || '',
            time: dateAndTime[1] || ''
        };
    };

    toggleTypeFilter = (transactionType: string) => {
        if (this.typeFilter.includes(transactionType)) {
            this.typeFilter = [...this.typeFilter.filter((t) => t !== transactionType)];
        } else {
            this.typeFilter.push(transactionType);
        }

        this.currentPage = 1;
        this.filterRecord();
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
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
            return this.paymentPipe.transform(transaction.externalPaymentObject?.source);
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
            return `<span>WAKI ${COMPANY_NAME}</span><span>3830 Wadi As Safa Street, Alaziziyah Dist, Jeddah</span>`;
        }

        if (transaction.trType === TransactionTypes.CouponPurchase) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.ADULT_VAT) {
            return `<span>WAKI ${COMPANY_NAME}</span><span>${WAKI_VAT}</span>`;
        }

        return '';
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

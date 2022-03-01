import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@portal/auth/services/auth.service';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import {
    defaultCanteenTransactionFilter,
    defaultTransactionFilter,
    ITransactionFilter
} from '@portal/canteen/models/transaction-filter.model';
import { TransactionTypes } from '@portal/canteen/models/transaction-types';
import { ITransaction } from '@portal/canteen/models/transaction.model';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { COMPANY_NAME, WAKI_VAT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { TransactionTypePipe } from '@portal/shared/pipes/transaction-type.pipe';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends ComponentBase implements OnChanges {
    @Input() form: FormGroup | undefined;
    @Input() transactions: ITransaction[] = [];
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() canteenOptions: ISelectOption[] = [];
    @Input() isLoading: boolean = true;
    @Input() recordCount = 0;
    @Output() filter = new EventEmitter<ITransactionFilter>();

    isAdmin: boolean = false;
    typeFilter: string[] = [];
    currentPage = 1;
    pageSize = defaultTransactionFilter.limit || 50;
    maxPage = 0;
    transactionTypes = TransactionTypes;

    constructor(
        private authService: AuthService,
        private cd: ChangeDetectorRef,
        private wakiDatePipe: WakiDatePipe,
        private excelExportService: ExcelExportService,
        private transactionTypePipe: TransactionTypePipe,
        private utilitiesService: UtilitiesService
    ) {
        super();

        this.isAdmin = this.authService.isAdmin() || this.authService.isSuperAdmin();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.transactions) {
            const numberOfPages = this.recordCount / this.pageSize;
            this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
            this.cd.detectChanges();
        }

        if (changes.form) {
            this.form!.get('search')!
                .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
                .subscribe(() => this.filterRecord());
        }
    }

    get pagesForPagination() {
        if (this.maxPage === 1) {
            return [1];
        }

        if (this.maxPage === 2) {
            return [1, 2];
        }

        if (this.currentPage === 1) {
            return [1, 2, 3];
        }

        if (this.currentPage + 1 <= this.maxPage) {
            return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        }

        return [this.maxPage - 2, this.maxPage - 1, this.maxPage];
    }

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
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

    mapSchoolOptions = (schools: ISchool[]) => {
        return selectOptions(schools);
    };

    getDateAndTime = (date: Date) => {
        const dateAndTime = this.wakiDatePipe.transform(date, true)?.split(' ');

        return {
            date: dateAndTime[0] || '',
            time: dateAndTime[1] || ''
        };
    };

    filterRecord = () => {
        if (!this.form?.valid) {
            return;
        }

        const formValue = this.form.value;

        const types = this.typeFilter.length
            ? this.typeFilter.map((c) => <TransactionTypes>c).join(',')
            : defaultCanteenTransactionFilter.trType;

        const transactionFilter: ITransactionFilter = {
            school: formValue.school || '',
            canteen: formValue.canteen || '',
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate),
            page: this.currentPage,
            limit: this.pageSize,
            trType: types,
            search: formValue.search || '',
            userType: 'canteen'
        };

        this.filter.emit(transactionFilter);
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
        if (transaction.trType === this.transactionTypes.TransferToCanteen) {
            return `<span>${transaction.canteen?.bankAccount?.accountNo}</span><span>${translationLang(transaction.canteen?.bankAccount?.bank?.translations)}</span>`;
        }

        if (transaction.trType === this.transactionTypes.VAT) {
            return `<span>${COMPANY_NAME}</span><span>${WAKI_VAT}</span>`;
        }

        if (
            transaction.trType === this.transactionTypes.TransactionFee ||
            transaction.trType === this.transactionTypes.WakiCouponFee
        ) {
            return `<span>${COMPANY_NAME}</span><span>3830 Wadi As Safa Street, Alaziziyah Dist, Jeddah</span>`;
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
            return '';
        }

        if (transaction.trType === TransactionTypes.TransferToCanteen) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.Refund) {
            return transaction.purposeOfRefund;
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

        if (
            transaction.trType === TransactionTypes.CouponPurchase ||
            transaction.trType === TransactionTypes.WakiCouponFee
        ) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.TransactionFee) {
            return translationLang(transaction.canteen?.translations);
        }

        if (transaction.trType === TransactionTypes.VAT) {
            return (
                translationLang(transaction.canteen?.translations) || `<span>3830 Wadi As Safa Street, Alaziziyah Dist, Jeddah</span>`
            );
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
            r['From'] = this.generateFromText(row) || ''; // row.from?.translations?.en || '' + ' ' + row.to?.mobileNo || '';
            r['To'] = this.removeSpanTag(this.generateToText(row) || ''); // row.student?.translations?.en || '' + ' ' + row.to?.mobileNo || '';
            r['Amount'] = row.amount || 0;
            r['balance'] = row.balance || 0;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Transactions`));
    };

    removeSpanTag = (text: string) => {
        if (!text || !text.length) {
            return '';
        }

        let removed = text.replace('</span><span>', ', ');
        removed = removed.replace('<span>', '');

        return removed.replace('</span>', '');
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

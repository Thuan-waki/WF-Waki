import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@portal/auth/services/auth.service';
import { ITransaction } from '@portal/canteen/models/transaction.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { TransactionService } from '@portal/canteen/services/transactions.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { defaultApiStatus } from '@portal/shared/models/api-status.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
    defaultCanteenTransactionFilter,
    defaultTransactionFilter,
    ITransactionFilter
} from '../../models/transaction-filter.model';

@Component({
    selector: 'app-transaction-page',
    templateUrl: './transaction-page.component.html',
    styleUrls: ['./transaction-page.component.scss']
})
export class TransactionPageComponent extends ComponentBase implements OnInit {
    transactions$ = new Observable<ITransaction[]>();
    recordCount: number = 0;
    form: FormGroup;
    pageEvent$ = new BehaviorSubject<ITransactionFilter>(defaultTransactionFilter);

    defaultApiStatus = defaultApiStatus;
    canteenOptions: ISelectOption[] = [];
    schoolOptions: ISelectOption[] = [];
    isLoading = true;
    filter: ITransactionFilter = defaultTransactionFilter;

    constructor(
        private fb: FormBuilder,
        private transactionService: TransactionService,
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private authService: AuthService,
        private toastr: ToastrService
    ) {
        super();

        this.form = this.fb.group({
            school: [null],
            canteen: [null],
            fromDate: [GetDisplayDate(defaultCanteenTransactionFilter.fromDate)],
            toDate: [GetDisplayDate(defaultCanteenTransactionFilter.toDate)],
            search: [null]
        });

        this.getSchools();

        if (this.authService.doesHaveRoles([UserRoles.WAKI_ADMIN, UserRoles.WAKI_SUPER_ADMIN])) {
            this.getCanteens();
        }
    }

    ngOnInit(): void {
        this.transactions$ = this.pageEvent$.asObservable().pipe(
            debounceTime(300),
            tap(() => (this.isLoading = true)),
            switchMap((filter: ITransactionFilter) => this.transactionService.getTransactions(filter)),
            map((res: HttpResponse<IApiResult>) => {
                this.recordCount = Number(res.headers?.get(X_TOTAL_COUNT)) || 0;
                return res.body?.transactions || [];
            }),
            tap(() => (this.isLoading = false)),
            catchError(() => {
                this.toastr.error('Failed to retrieve Transactions', 'Transactions');
                return of<ITransaction[]>();
            })
        );
    }

    getSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.schools?.length) {
                        this.schoolOptions = selectOptions(result.schools || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    onPageChanged = (filter: ITransactionFilter) => {
        this.filter = filter;
        this.pageEvent$.next(filter);
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
}

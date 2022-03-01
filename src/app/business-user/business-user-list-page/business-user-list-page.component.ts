import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { defaultBusinessUserFilter, IUser, IUserFilter } from '@portal/shared/models/user.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { DialogService } from '@portal/shared/services/dialog.service';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UserService } from '@portal/shared/services/user.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-business-user-list-page',
    templateUrl: './business-user-list-page.component.html',
    styleUrls: ['./business-user-list-page.component.scss']
})
export class BusinessUserListPageComponent extends ComponentBase {
    users: IUser[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultBusinessUserFilter.limit || 50;

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private router: Router,
        private dialogService: DialogService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe,
        private utilitiesService: UtilitiesService
    ) {
        super();

        this.getUsers(defaultBusinessUserFilter);
    }

    getUsers = (filter: IUserFilter) => {
        this.isLoading = true;
        this.users = [];

        this.userService
            .getUsers(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.users = result.body?.users || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve users', 'Users');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve users', 'Users');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    newUser = () => {
        this.router.navigateByUrl('business-users/form');
    };

    editUser = (id: string) => {
        this.router.navigateByUrl(`business-users/form/${id}`);
    };

    exportToExcel = () => {
        const rows = this.users.map((row) => {
            const r: any = {};

            r['Name (English)'] = row.translations?.en || '';
            r['Name (Arabic)'] = row.translations?.ar || '';
            r['Email'] = row.email;
            r['Mobile Number'] = row.mobileNo;
            r['Created At'] = this.wakiDatePipe.transform(row.createdAt || new Date());

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Business_Users`));
    };
}

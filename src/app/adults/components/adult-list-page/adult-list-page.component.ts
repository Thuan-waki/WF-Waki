import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultParentFilter, IParent, IParentFilter } from '@portal/adults/models/parent.model';
import { ParentService } from '@portal/adults/services/parent.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-adult-list-page',
    templateUrl: './adult-list-page.component.html',
    styleUrls: ['./adult-list-page.component.scss']
})
export class AdultListPageComponent extends ComponentBase implements OnInit {
    parents: IParent[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultParentFilter.limit || 50;
    constructor(
        private parentService: ParentService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private router: Router,
        private utilitiesService: UtilitiesService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getParents(defaultParentFilter);
    }

    getParents = (filter: IParentFilter) => {
        this.isLoading = true;
        this.parents = [];

        this.parentService
            .getParents(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.parents = result.body?.parents || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve parents', 'Parents');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to load parents', 'Parents');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    editParent = (id: string) => {
        this.router.navigate([`/adults/form/${id}`]);
    };

    exportToExcel = () => {
        const rows = this.parents.map((row) => {
            const r: any = {};

            r['National ID'] = row.user?.nationalId || '';
            r['Parent Name (English)'] = row.user?.translations?.en || '';
            r['Parent Name (Arabic)'] = row.user?.translations?.ar || '';
            r['Mobile Number'] = row.user?.mobileNo || '';
            r['Card UID'] = row.user?.cardId || '';
            r['Card Serial No'] = row.user?.cardSerialNo || '';
            r['Email'] = row.user?.email || '';
            r['Max Amount'] = row.maxAmount || '';
            r['Available Amount'] = row.availableAmount || '';
            r['# of Dependents'] = row.noOfChildren || '';

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Parents`));
    };

    map = (currentParent: any) => {
        const currentUser = currentParent.user;
        const parent: any = {
            user: {
                translations: currentUser.translations,
                nationalId: currentUser.nationalId,
                mobileNo: currentUser.mobileNo,
                email: currentUser.email,
                sex: currentUser.gender,
                cardId: currentUser.cardId?.length ? currentUser.cardId : null,
                cardSerialNo: currentUser.cardSerialNo?.length ? currentUser.cardSerialNo : null,
                isValid: currentUser.isValid
            }
        };

        return parent;
    };

    save = (currentParent: IParent) => {
        const parent = this.map(currentParent); 

        this.parentService
            .patchParent(currentParent?._id || '', parent)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.toastr.success('Parent Saved', 'Parent');
                    } else {
                        this.toastr.error('Failed to Save Parent', 'Parent');
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to Save Parent', 'Parent');
                    return of();
                })
            )
            .subscribe();
    };
}

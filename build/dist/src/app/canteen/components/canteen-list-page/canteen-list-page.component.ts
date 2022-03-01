import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultCanteenFilter, ICanteenFilter } from '@portal/canteen/models/canteen-filter.model';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-list-page',
    templateUrl: './canteen-list-page.component.html',
    styleUrls: ['./canteen-list-page.component.scss']
})
export class CanteenListPageComponent extends ComponentBase implements OnInit {
    canteens: ICanteen[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultCanteenFilter.limit || 50;
    isSuperAdmin = false;

    constructor(
        private canteenService: CanteenService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private excelExportService: ExcelExportService,
        private utilitiesService: UtilitiesService
    ) {
        super();
        this.isSuperAdmin = this.authService.isSuperAdmin();
    }

    ngOnInit(): void {
        this.getCanteens(defaultCanteenFilter);
    }

    getCanteens = (filter: ICanteenFilter) => {
        this.isLoading = true;
        this.canteens = [];

        this.canteenService
            .getCanteens(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.canteens = result.body?.canteens || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve canteens', 'canteens');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to retrieve canteens', 'canteens');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    newCanteen = () => {
        this.router.navigate(['/canteens/form']);
    };

    editCanteen = (canteenId: string) => {
        this.router.navigate([`/canteens/form/${canteenId}`]);
    };

    exportToExcel = () => {
        const rows = this.canteens.map((row) => {
            const r: any = {};

            r['Canteen Name (English)'] = row.translations?.en || '';
            r['Canteen Name (Arabic)'] = row.translations?.ar || '';
            r['Canteen ID'] = row.canteenId || '';
            r['Cateen VAT'] = row.vat || '';
            r['School (English)'] = row.schools[0]?.translations?.en;
            r['School (Arabic)'] = row.schools[0]?.translations?.ar;
            r['Mobile Number'] = row.mobileNo || '';
            r['Phone'] = row.phone || '';

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Canteens`));
    };
}

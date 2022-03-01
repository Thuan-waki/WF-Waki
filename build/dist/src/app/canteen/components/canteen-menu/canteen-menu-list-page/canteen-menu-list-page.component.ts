import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultCanteenMenuFilter, ICanteenMenu, ICanteenMenuFilter } from '@portal/canteen/models/canteen-menu.model';
import { CanteenMenuService } from '@portal/canteen/services/canteen-menu.service';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-menu-list-page',
    templateUrl: './canteen-menu-list-page.component.html',
    styleUrls: ['./canteen-menu-list-page.component.scss']
})
export class CanteenMenuListPageComponent extends ComponentBase {
    canteenId: string;
    canteenMenus: ICanteenMenu[] = [];
    schoolOptions: any[] = [];
    canteenOptions: any[] = [];
    isLoading = true;
    isAdmin = false;
    isCanteenUser = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultCanteenMenuFilter.limit || 50;
    hasPaidOrder: boolean = false;

    constructor(
        private canteenMenuService: CanteenMenuService,
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private excelExportService: ExcelExportService,
        private utilitiesService: UtilitiesService
    ) {
        super();
        this.canteenId = this.authService.getUserCanteenId();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        this.isCanteenUser = !this.isAdmin && this.canteenId.length > 0;

        if (this.isAdmin) {
            this.getAllSchools();
            this.getCanteens();
        } else {
            this.getCanteenMenus({ ...defaultCanteenMenuFilter, canteen: this.canteenId });
        }
    }

    getCanteenMenus = (filter: ICanteenMenuFilter) => {
        this.isLoading = true;

        this.canteenMenuService
            .getCanteenMenus(filter.canteen!, filter)
            .pipe(
                tap((res: HttpResponse<IApiResult>) => {
                    if (res.body?.success) {
                        this.canteenMenus = [...(res.body?.canteenMenus || [])];
                        this.recordCount = Number(res.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    } else {
                        this.toastr.error('Failed to load canteen menus', 'Canteen Menus');
                    }
                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to load canteen menus', 'Canteen Menus');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    getAllSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.schools && result.schools.length) {
                        this.schoolOptions = selectOptions(result.schools || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
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

                        this.getCanteenMenus({ ...defaultCanteenMenuFilter, canteen: this.canteenId });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    add = () => {
        this.router.navigate(['/canteens/canteen-menu/form']);
    };

    edit = (menu: ICanteenMenu) => {
        this.router.navigate([`/canteens/canteen-menu/form`], { queryParams: { id: menu._id, canteen: menu.canteen } });
    };

    exportToExcel = () => {
        const rows = this.canteenMenus.map((row) => {
            const r: any = {};

            r['Menu Name en'] = row.translations?.en || '';
            r['Menu Name ar'] = row.translations?.ar || '';
            r['Food Items'] = row.foodItems?.join(', ');
            r['Enabled for WAKI App'] = row.enabledForParentApp;
            r['Enabled for WAKI Business App'] = row.enabledForDeviceApp;
            // r['Is Published'] = row.isPublished;
            r['Is Valid'] = row.isValid;
            r['Is Deleted'] = row.isDeleted;
            r['Canteen'] = row.canteen;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Canteen_Menus`));
    };
}

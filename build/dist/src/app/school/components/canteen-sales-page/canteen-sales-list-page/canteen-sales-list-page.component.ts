import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultFoodorderFilter, IFoodOrderFilter } from '@portal/canteen/models/food-order-filter.model';
import { IFoodOrder } from '@portal/canteen/models/food-order.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { FoodOrderService } from '@portal/canteen/services/food-order.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { GenderPipe } from '@portal/shared/pipes/gender.pipe';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-sales-list-page',
    templateUrl: './canteen-sales-list-page.component.html',
    styleUrls: ['./canteen-sales-list-page.component.scss']
})
export class CanteenSalesListPageComponent extends ComponentBase {
    foodOrders: IFoodOrder[] | undefined;
    isLoading: boolean = true;
    recordCount: number = 0;
    maxPage: number = 0;
    pageSize: number = defaultFoodorderFilter.limit || 50;
    hasPaidOrder: boolean = false;
    schoolOptions: ISelectOption[] = [];
    canteenOptions: ISelectOption[] = [];
    isSchoolUser = true;
    isAdmin = false;
    selectedSchoolId: string = '';
    selectedCanteenId: string = '';

    constructor(
        private foodOrderService: FoodOrderService,
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe
    ) {
        super();

        this.isSchoolUser = this.authService.isSchoolUser() || this.authService.isSuperSchoolUser();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();

        if (this.isAdmin) {
            this.getSelectSchools();
        } else if (this.isSchoolUser) {
            this.selectedSchoolId = this.authService.getUserSchoolId();
            this.getSelectCanteens(this.selectedSchoolId);
        }
    }

    getFoodOrders = (filter: IFoodOrderFilter) => {
        this.isLoading = true;
        this.foodOrders = [];
        this.selectedCanteenId = filter.canteen || '';

        this.foodOrderService
            .getFoodOrders(filter.canteen!, filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.foodOrders = result.body?.foodOrders || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                        this.hasPaidOrder = this.foodOrders.some((order) => order.orderStatus === 'PAID');
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Food Orders Missing', 'Food Order');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to load food orders', 'Food Order');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    getSelectCanteens = (schoolId?: string, filter?: IFoodOrderFilter) => {
        this.canteenService
            .getSelectCanteens(['id', 'translations'], schoolId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.canteens?.length) {
                        this.canteenOptions = (result.canteens || []).map((canteen) => {
                            return {
                                label: translationLang(canteen.translations),
                                value: canteen._id
                            };
                        });

                        if (this.canteenOptions.length) {
                            this.selectedCanteenId = this.canteenOptions[0].value;

                            if (filter) {
                                this.getFoodOrders({ ...filter, canteen: this.selectedCanteenId });
                            } else {
                                this.getFoodOrders({ ...defaultFoodorderFilter, canteen: this.selectedCanteenId });
                            }
                        }
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getSelectSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations', 'canteens'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.schoolOptions = (result.schools || []).map((school) => {
                            return {
                                label: translationLang(school?.translations),
                                value: school?._id
                            };
                        });

                        if (this.schoolOptions.length) {
                            this.selectedSchoolId = this.schoolOptions[0].value;
                            this.getSelectCanteens(this.selectedSchoolId);
                        }
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    schoolChange = (filter: IFoodOrderFilter) => {
        this.canteenOptions = [];
        this.selectedCanteenId = '';
        this.getSelectCanteens(filter.school, filter);
    };

    exportToExcel = () => {
        if (!this.foodOrders) {
            return;
        }

        const rows = this.foodOrders.map((row) => {
            const r: any = {};

            r['Order ID'] = row.orderId;
            r['Invoice No.'] = row.invoice?.invoiceNo;
            r['Order Date'] = this.wakiDatePipe.transform(row.createdAt);
            r['Delivery Date'] = this.wakiDatePipe.transform(row.orderDate);
            r['Student Name'] = translationLang(row.student?.translations);
            r['Class'] = row.student?.grade?.grade;
            r['Section'] = row.student?.section;
            r['Subtotal'] = row.orderStatus === 'RETURNED' ? row.subTotal * -1 : row.subTotal || 0;

            return r;
        });

        this.excelExportService.exportExcel(rows, `Canteen_Orders`);
    };
}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultFoodorderFilter, IFoodOrderFilter } from '@portal/canteen/models/food-order-filter.model';
import { IFoodOrder, IFoodOrderItem } from '@portal/canteen/models/food-order.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { FoodOrderService } from '@portal/canteen/services/food-order.service';
import { SchoolService } from '@portal/canteen/services/school.service';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { DialogType } from '@portal/shared/enums/dialog-type.enum';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { GenderPipe } from '@portal/shared/pipes/gender.pipe';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { DialogService } from '@portal/shared/services/dialog.service';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-food-order-list-page',
    templateUrl: './food-order-list-page.component.html',
    styleUrls: ['./food-order-list-page.component.scss']
})
export class FoodOrderListPageComponent extends ComponentBase implements OnInit {
    canteenId: string = '';
    foodOrders: IFoodOrder[] = [];
    schoolOptions: ISelectOption[] = [];
    canteenOptions: ISelectOption[] = [];
    isLoading = true;
    isAdmin = false;
    isCanteenUser = false;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultFoodorderFilter.limit || 50;
    hasPaidOrder: boolean = false;
    schools: ISchool[] = [];
    currentDate = moment().format('YYYY-MM-DD');

    constructor(
        private foodOrderService: FoodOrderService,
        private canteenService: CanteenService,
        private authService: AuthService,
        private schoolService: SchoolService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private utilitesService: UtilitiesService,
        private wakiDatePipe: WakiDatePipe,
        private genderPipe: GenderPipe,
        private dialogService: DialogService
    ) {
        super();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        this.isCanteenUser = this.authService.isCanteenUser() || this.authService.isSuperCanteenUser();
        this.canteenId = this.authService.getUserCanteenId();
        this.schools = [...this.authService.getUserSchools()];
    }

    ngOnInit(): void {
        this.getAllSchools();
        if (this.isAdmin) {
            this.getCanteens();
        } else {
            this.getFoodOrders({ ...defaultFoodorderFilter, canteen: this.canteenId! });
        }
    }

    getFoodOrders = (filter: IFoodOrderFilter) => {
        this.isLoading = true;
        this.foodOrders = [];

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

    markAllDelivered = (filter: IFoodOrderFilter) => {
        this.dialogService
            .confirm(
                'Mark All Order Delivered',
                'This action will mark all order <b>Delivered</b><br/>Click confirm to proceed',
                'confirm',
                'Cancel',
                DialogType.Warning
            )
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res) => {
                if (res) {
                    this.isLoading = true;

                    this.foodOrderService
                        .markAllDelivered(this.canteenId, this.currentDate)
                        .pipe(
                            tap(() => {
                                this.toastr.success('Marked all order as Delivered', 'Mark Delivered');
                                this.getFoodOrders(filter);
                            }),
                            takeUntil(this.destroyed$),
                            catchError(() => {
                                this.toastr.error('Failed to mark all order as Delivered', 'Mark Delivered');
                                this.isLoading = false;
                                return of();
                            })
                        )
                        .subscribe();
                }
            });
    };

    markAllRejected = (filter: IFoodOrderFilter) => {
        this.dialogService
            .confirm(
                'Mark All Order Rejected',
                'This action will mark all order <b>Rejected</b><br/>Click confirm to proceed',
                'confirm',
                'Cancel',
                DialogType.Warning
            )
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res) => {
                if (res) {
                    this.isLoading = true;

                    this.foodOrderService
                        .markAllRejected(this.canteenId, this.currentDate)
                        .pipe(
                            tap(() => {
                                this.toastr.success('Marked all order as Rejected', 'Mark Rejected');
                                this.getFoodOrders(filter);
                            }),
                            takeUntil(this.destroyed$),
                            catchError(() => {
                                this.toastr.error('Failed to mark all order as Rejected', 'Mark Rejected');
                                this.isLoading = false;
                                return of();
                            })
                        )
                        .subscribe();
                }
            });
    };

    getAllSchools = () => {
        this.schoolService
            .getSchools()
            .pipe(
                tap((result: IApiResult) => {
                    if (result.schools && result.schools.length) {
                        this.schools = [...result.schools];
                        this.schoolOptions = selectOptions(this.schools);
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
                        this.getFoodOrders({ ...defaultFoodorderFilter, canteen: this.canteenId });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    exportToExcel = () => {
        const itemCounts: number[] = this.foodOrders.map((order) => order.items?.length || 0);
        const returnedItemCounts: number[] = this.foodOrders.map((order) => order.items?.length || 0);
        const maxItemCount = Math.max(...itemCounts);
        const maxReturnItemCount = Math.max(...returnedItemCounts);

        const rows = this.foodOrders.map((row) => {
            const r: any = {};

            r['Order ID'] = row.orderId;
            r['Order Date'] = this.wakiDatePipe.transform(row.createdAt);
            r['Delivery Date'] = this.wakiDatePipe.transform(row.orderDate);
            r['Student Name'] = translationLang(row.student?.translations);
            r['Gender'] = this.genderPipe.transform(row.student?.user?.sex || '');
            r['School'] = translationLang(row.school?.translations);
            r['Class'] = row.student?.grade?.grade || '';
            r['Section'] = row.student?.section || '';

            const foodItems: IFoodOrderItem[] = [];
            const returnFoodItems: IFoodOrderItem[] = [];

            row.items?.forEach((item: IFoodOrderItem) => {
                if (foodItems.findIndex((rItem: IFoodOrderItem) => rItem.food?._id === item.food?._id) < 0) {
                    foodItems.push(item);
                }
            });

            row.returnItems?.forEach((item: IFoodOrderItem) => {
                if (returnFoodItems.findIndex((rItem: IFoodOrderItem) => rItem.food?._id === item.food?._id) < 0) {
                    returnFoodItems.push(item);
                }
            });

            for (let i = 0; i < maxItemCount; i++) {
                if (foodItems.length - 1 < i) {
                    r[`Food item Order (English) ${i + 1}`] = '';
                } else {
                    r[`Food item Order (English) ${i + 1}`] = `${translationLang(foodItems[i].food.translations)}${
                        foodItems[i].selectedCustomizations.length
                            ? ', customizations: ' +
                            foodItems[i].selectedCustomizations
                                .map((cusomization) => translationLang(cusomization.customization.translations))
                                .join(', ')
                            : ''
                        }`;
                }
            }

            for (let i = 0; i < maxReturnItemCount; i++) {
                if (returnFoodItems.length - 1 < i) {
                    r[`Food item Return (English) ${i + 1}`] = '';
                } else {
                    r[`Food item Return (English) ${i + 1}`] = `${translationLang(returnFoodItems[i].food.translations)}${
                        returnFoodItems[i].selectedCustomizations.length
                            ? ', customizations: ' +
                            returnFoodItems[i].selectedCustomizations
                                .map((cusomization) => translationLang(cusomization.customization.translations))
                                .join(', ')
                            : ''
                        }`;
                }
            }

            for (let i = 0; i < maxItemCount; i++) {
                if (foodItems.length - 1 < i) {
                    r[`Food item Order (Arabic) ${i + 1}`] = '';
                } else {
                    r[`Food item Order (Arabic) ${i + 1}`] = `${foodItems[i].food.translations.ar}${
                        foodItems[i].selectedCustomizations.length
                            ? ', customizations: ' +
                            foodItems[i].selectedCustomizations
                                .map((customization) => translationLang(customization.customization.translations))
                                .join(', ')
                            : ''
                        }`;
                }
            }

            for (let i = 0; i < maxReturnItemCount; i++) {
                if (returnFoodItems.length - 1 < i) {
                    r[`Food item Return (Arabic) ${i + 1}`] = '';
                } else {
                    r[`Food item Return (Arabic) ${i + 1}`] = `${returnFoodItems[i].food.translations.ar}${
                        returnFoodItems[i].selectedCustomizations.length
                            ? ', customizations: ' +
                            returnFoodItems[i].selectedCustomizations
                                .map((customization) => translationLang(customization.customization.translations))
                                .join(', ')
                            : ''
                        }`;
                }
            }

            r['Sub Total'] = row.orderStatus === 'RETURNED' ? row.subTotal * -1 : row.subTotal || 0;
            r['VAT'] = row.orderStatus === 'RETURNED' ? row.vatAmount * -1 : row.vatAmount || 0;
            r['Coupon Discount'] = this.getCouponDiscount(row) || 0;
            r['Total Amount'] = this.getTotalAmount(row) || 0;
            r['Status'] = row.orderStatus;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitesService.generateExcelFileName(`Food_Order`));
    };

    getCouponDiscount = (order: IFoodOrder) => {
        return order.coupon
            ? order.isPartialCoveredByCoupon
                ? order.totalAmount - order.partialBalanceAmount
                : order.totalAmount
            : '';
    };

    getTotalAmount = (order: IFoodOrder) => {
        const amount = order.coupon ? order.partialBalanceAmount : order.totalAmount;

        return order.orderStatus === 'RETURNED' ? amount * -1 : amount;
    };

    markAsDelivered = (data: any) => {
        const filteredPaidOrders = this.foodOrders
            .filter((order) => data.orderIds[order._id]);

        const isNotSameDay = filteredPaidOrders
            ?.findIndex((order) => !moment(filteredPaidOrders[0].orderDate).isSame(order.orderDate, 'date'));

        if (isNotSameDay > -1) {
            this.toastr.error('Make sure you select orders in same day', 'Mark Delivered');
            this.isLoading = false;
            return;
        }
        
        const paidIds = filteredPaidOrders
            ?.filter((order) => order.orderStatus === 'PAID')
            ?.map((order) => order._id);

        if (paidIds.length) {
            this.isLoading = true;

            this.foodOrderService
                .markOrdersAs(this.canteenId, paidIds, 'DELIVERED')
                .pipe(
                    tap(() => {
                        this.toastr.success('Marked order as Delivered', 'Mark Delivered');
                        this.getFoodOrders(data.filterValues);
                    }),
                    takeUntil(this.destroyed$),
                    catchError(() => {
                        this.toastr.error('Failed to mark order as Delivered', 'Mark Delivered');
                        this.isLoading = false;
                        return of();
                    })
                )
                .subscribe();
        }
    };

    markAsRejected = (data: any) => {
        const filteredPaidOrders = this.foodOrders
            .filter((order) => data.orderIds[order._id]);

        const isNotSameDay = filteredPaidOrders
            ?.findIndex((order) => !moment(filteredPaidOrders[0].orderDate).isSame(order.orderDate, 'date'));

        if (isNotSameDay > -1) {
            this.toastr.error('Make sure you select orders in same day', 'Mark Rejected');
            this.isLoading = false;
            return;
        }
        
        const foodOrderIds = filteredPaidOrders.map((order) => order._id);

        if (foodOrderIds.length) {
            this.isLoading = true;            

            this.foodOrderService
                .markOrdersAs(this.canteenId, foodOrderIds, 'REJECTED')
                .pipe(
                    tap(() => {
                        this.toastr.success('Marked order as Rejected', 'Mark Rejected');
                        this.getFoodOrders(data.filterValues);
                    }),
                    takeUntil(this.destroyed$),
                    catchError(() => {
                        this.toastr.error('Failed to mark order as Rejected', 'Mark Rejected');
                        this.isLoading = false;
                        return of();
                    })
                )
                .subscribe();
        }
    };
}

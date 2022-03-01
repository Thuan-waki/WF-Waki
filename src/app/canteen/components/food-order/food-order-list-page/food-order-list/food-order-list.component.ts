/* eslint-disable prettier/prettier */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { defaultFoodorderFilter, IFoodOrderFilter } from '@portal/canteen/models/food-order-filter.model';
import { IFoodOrder, IFoodOrderItem, IFoodOrderItemFood } from '@portal/canteen/models/food-order.model';
import { OrderTypes } from '@portal/canteen/models/order-types';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { genderOptions } from '@portal/shared/constants/gender';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ShortenPipe } from '@portal/shared/pipes/shorten.pipe';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FoodOrderDetailDialogComponent } from '../food-order-detail-dialog/food-order-detail-dialog.component';

@Component({
    selector: 'app-food-order-list',
    templateUrl: './food-order-list.component.html',
    styleUrls: ['./food-order-list.component.scss']
})
export class FoodOrderListComponent extends ComponentBase implements OnChanges {
    @Input() foodOrders: IFoodOrder[] = [];
    @Input() schools: ISchool[] = [];
    @Input() canteenOptions: any[] = [];
    @Input() selectedCanteenId: string = '';
    @Input() isLoading = true;
    @Input() isAdmin = false;
    @Input() isCanteenUser = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultFoodorderFilter.limit || 50;
    @Input() hasPaidOrder: boolean = false;
    @Output() filter = new EventEmitter<IFoodOrderFilter>();
    @Output() export = new EventEmitter();
    @Output() markAllDelivered = new EventEmitter();
    @Output() markAllRejected = new EventEmitter();
    @Output() markAsDelivered = new EventEmitter();
    @Output() markAsRejected = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: [''],
        school: [null],
        canteen: [null],
        orderType: [null],
        orderFromDate: [''],
        orderToDate: [''],
        fromDate: [''],
        toDate: [''],
        gender: ['']
    });
    currentPage = 1;
    schoolOptions: any = [];
    orderTypes = OrderTypes;
    orderTypeFilter: string = '';
    isFilteredByOrderStatus = false;
    todayOrderFilter = false;
    genderOptions: any;
    objectKeys: any = Object.keys;
    selectedOrderIds: any = {};

    constructor(private fb: FormBuilder, private shortenPipe: ShortenPipe, private modalService: NgbModal) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
        this.mapGenderOptions();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.schools) {
            this.schoolOptions = [];
            this.schoolOptions = [...this.mapSchoolOptions(this.schools)];

            if (this.schools.length === 1) {
                this.form.get('school')?.setValue(this.schools[0]._id);
                this.form.get('school')?.updateValueAndValidity();
            }
        }

        if (changes.selectedCanteenId) {
            this.form.get('canteen')?.setValue(this.selectedCanteenId);
            this.form.get('canteen')?.updateValueAndValidity();
        }
    }

    mapGenderOptions = () => {
        this.genderOptions = genderOptions.map((g) => ({ value: g.value, label: translationLang(g.translations)}));
    }

    mapSchoolOptions = (schools: ISchool[]) => {
        if (!schools || !schools.length) {
            return [];
        }

        return schools.map((s) => ({ value: s._id, label: translationLang(s.translations) }));
    };

    onMarkAllDeliveredClick = () => {
        const filterValues = this.getFilter();

        this.markAllDelivered.emit(filterValues);
    };

    onMarkAllRejectedClick = () => {
        const filterValues = this.getFilter();

        this.markAllRejected.emit(filterValues);
    };

    getFilter = () => {
        const formValue = this.form.getRawValue();

        let filterValues: IFoodOrderFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            school: formValue.school || '',
            canteen: formValue.canteen || '',
            orderType: this.orderTypeFilter,
            orderStatus: this.isFilteredByOrderStatus ? 'RETURNED,REJECTED' : '',
            orderFromDate: formValue.orderFromDate?.toString().length ? new Date(formValue.orderFromDate) : '',
            orderToDate: formValue.orderToDate?.toString().length ? new Date(formValue.orderToDate) : '',
            fromDate: formValue.fromDate?.toString().length ? new Date(formValue.fromDate) : '',
            toDate: formValue.toDate?.toString().length ? new Date(formValue.toDate) : '',
            gender: formValue.gender
        };

        if (this.todayOrderFilter) {
            filterValues = {
                ...filterValues,
                orderType: OrderTypes.AppOrder
            };
        }

        return filterValues;
    };

    filterRecord = () => {
        this.currentPage = 1;
        const filterValues = this.getFilter();
        this.filter.emit(filterValues);
    };

    toggleTypeFilter = (orderType: string) => {
        if (this.orderTypeFilter === orderType) {
            this.orderTypeFilter = '';
        } else {
            this.orderTypeFilter = orderType;
        }

        this.currentPage = 1;
        this.filterRecord();
    };

    filterByOrderStatus = () => {
        this.isFilteredByOrderStatus = !this.isFilteredByOrderStatus;
        this.filterRecord();
    }

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    getTodayOrders = () => {
        this.todayOrderFilter = !this.todayOrderFilter;

        if (this.todayOrderFilter) {
            this.form.get('fromDate')?.setValue(GetDisplayDate(new Date()));
            this.form.get('toDate')?.setValue(GetDisplayDate(new Date()));
            this.form.updateValueAndValidity();
        } else {
            this.form.get('fromDate')?.setValue('');
            this.form.get('toDate')?.setValue('');
            this.form.updateValueAndValidity();
        }

        this.filterRecord();
    };

    getFoodItems = (foodOrder: IFoodOrder) => {
        try {
            const orderedFoodItems = foodOrder?.items.map((item: IFoodOrderItem) => item.food);
            const returnFoodItems = foodOrder?.returnItems.map((item: IFoodOrderItem) => item.food);

            let foodItems: IFoodOrderItemFood[] = [...orderedFoodItems, ...returnFoodItems];

            const uniqueFoodItems: IFoodOrderItemFood[] = [];

            foodItems.map((foodItem) => {
                if (uniqueFoodItems.findIndex((item) => item._id === foodItem._id) < 0) {
                    uniqueFoodItems.push(foodItem);
                }
            });

            return this.shortenPipe.transform(uniqueFoodItems
                .map((f) => translationLang(f.translations))
                .join(', '), 40, '...');
        } catch {
            return '';
        }
    };

    getCouponDiscount = (order: IFoodOrder) => {
        return order.coupon ? (order.isPartialCoveredByCoupon ? (order.totalAmount - order.partialBalanceAmount) : order.totalAmount) : ''
    }

    getTotalAmount = (order: IFoodOrder) => {
        const amount = order.coupon ? order.partialBalanceAmount : order.totalAmount;

        return order.orderStatus === 'RETURNED' ? amount * -1 : amount;
    }

    showFoodOrderItemDetails = (foodOrder: IFoodOrder) => {
        const modalRef = this.modalService.open(FoodOrderDetailDialogComponent, {
            size: 'xl',
            backdrop: 'static'
        });

        modalRef.componentInstance.foodOrder = foodOrder;
        modalRef.componentInstance.orderId = foodOrder.orderId;
        modalRef.componentInstance.items = foodOrder.items;
        modalRef.componentInstance.returnItems = foodOrder.returnItems;

        modalRef.result.then(() => {}).catch();
    }

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }

    onSelectedOrders = (event: any, orderId: string) => {
        const checked = event.target.checked;
        if (checked || !this.selectedOrderIds[orderId]) {
            this.selectedOrderIds[orderId] = checked;
        } else {
            delete this.selectedOrderIds[orderId];
        }
    }

    onMarkAsDeliveredOrders = () => {
        const data = {
            filterValues: this.getFilter(),
            orderIds: this.selectedOrderIds
        }

        this.markAsDelivered.emit(data);
    }

    onMarkAsRejectedOrders = () => {
        const data = {
            filterValues: this.getFilter(),
            orderIds: this.selectedOrderIds
        }

        this.markAsRejected.emit(data);
    }
}

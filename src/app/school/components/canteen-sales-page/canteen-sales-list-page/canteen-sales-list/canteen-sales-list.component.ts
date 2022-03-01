import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultFoodorderFilter, IFoodOrderFilter } from '@portal/canteen/models/food-order-filter.model';
import { IFoodOrder } from '@portal/canteen/models/food-order.model';
import { OrderTypes } from '@portal/canteen/models/order-types';
import { ComponentBase } from '@portal/shared/components/component-base';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-sales-list',
    templateUrl: './canteen-sales-list.component.html',
    styleUrls: ['./canteen-sales-list.component.scss']
})
export class CanteenSalesListComponent extends ComponentBase implements OnChanges {
    @Input() foodOrders: IFoodOrder[] | undefined;
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() canteenOptions: ISelectOption[] = [];
    @Input() selectedCanteenId: string = '';
    @Input() selectedSchoolId: string = '';
    @Input() isLoading = true;
    @Input() isAdmin = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultFoodorderFilter.limit || 50;
    @Input() hasPaidOrder: boolean = false;
    @Output() filter = new EventEmitter<IFoodOrderFilter>();
    @Output() export = new EventEmitter();
    @Output() schoolChange = new EventEmitter<IFoodOrderFilter>();

    form: FormGroup = this.fb.group({
        search: [''],
        school: [null],
        canteen: [null],
        orderType: [null],
        orderFromDate: [''],
        orderToDate: [''],
        fromDate: [''],
        toDate: ['']
    });
    currentPage = 1;
    orderTypes = OrderTypes;
    orderTypeFilter: string = '';
    isFilteredByOrderStatus = false;
    todayOrderFilter = false;

    constructor(private fb: FormBuilder) {
        super();

        this.form!.get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedCanteenId) {
            this.form.get('canteen')?.setValue(this.selectedCanteenId);
            this.form.get('canteen')?.updateValueAndValidity();
        }

        if (changes.selectedSchoolId) {
            this.form.get('school')?.setValue(this.selectedSchoolId);
            this.form.get('school')?.updateValueAndValidity();
        }
    }

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
            toDate: formValue.toDate?.toString().length ? new Date(formValue.toDate) : ''
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

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }

    onSchoolChange = () => {
        this.canteenOptions = [];
        this.foodOrders = undefined;
        this.form.get('canteen')?.setValue(null);
        this.form.get('canteen')?.updateValueAndValidity();
        const filter = this.getFilter();
        this.schoolChange.emit(filter);
    };
}

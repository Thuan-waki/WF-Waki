import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { defaultCouponOrderFilter, ICouponOrder, ICouponOrderFilter } from '@portal/canteen/models/coupon-order.model';
import { defaultCouponFilter } from '@portal/canteen/models/coupon.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-coupon-order-list',
    templateUrl: './coupon-order-list.component.html',
    styleUrls: ['./coupon-order-list.component.scss']
})
export class CouponOrderListComponent extends ComponentBase {
    @Input() couponOrders: ICouponOrder[] = [];
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() canteenOptions: ISelectOption[] = [];
    @Input() studentOptions: ISelectOption[] = [];
    @Input() couponOptions: ISelectOption[] = [];
    @Input() couponId = '';
    @Input() isAdmin = false;
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultCouponFilter.limit || 50;
    @Output() filter = new EventEmitter<ICouponOrderFilter>();
    @Output() export = new EventEmitter();
    @Output() email = new EventEmitter<string>();
    @Output() download = new EventEmitter<string>();

    form: FormGroup = this.fb.group({
        school: [null],
        canteen: [null],
        student: [null],
        fromDate: [GetDisplayDate(defaultCouponOrderFilter.fromDate)],
        toDate: [GetDisplayDate(defaultCouponOrderFilter.toDate)],
        search: [null],
        coupon: [null]
    });
    currentPage = 1;

    constructor(private fb: FormBuilder, private wakiDatePipe: WakiDatePipe, private route: ActivatedRoute) {
        super();

        const coupon = this.route.snapshot.queryParams.coupon;

        if (coupon) {
            this.form.get('coupon')?.setValue(coupon);
            this.form.updateValueAndValidity();
        }

        this.form!.get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: ICouponOrderFilter = {
            school: formValue.school,
            canteen: formValue.canteen,
            student: formValue.student,
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate),
            page: this.currentPage,
            limit: this.pageSize,
            search: formValue.search || '',
            coupon: formValue.coupon || ''
        };

        this.filter.emit(filterValues);
    };

    getDateAndTime = (date: Date) => {
        const dateAndTime = this.wakiDatePipe.transform(date, true)?.split(' ');

        return {
            date: dateAndTime[0] || '',
            time: dateAndTime[1] || ''
        };
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

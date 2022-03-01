import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultFeeFilter, IFee } from '@portal/fee/models/fee.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';

@Component({
    selector: 'app-fee-list',
    templateUrl: './fee-list.component.html',
    styleUrls: ['./fee-list.component.scss']
})
export class FeeListComponent implements OnChanges {
    @Input() fees: IFee[] | undefined;
    @Input() canteenOptions: ISelectOption[] = [];
    @Input() selectedCanteenId: string = '';
    @Input() isLoading: Boolean = true;
    @Input() isAdmin = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultFeeFilter.limit || 50;
    @Output() email = new EventEmitter<string>();
    @Output() download = new EventEmitter<string>();
    @Output() filter = new EventEmitter<any>();

    form: FormGroup = this.fb.group({
        canteen: [''],
        fromDate: [''],
        toDate: ['']
    });
    currentPage = 1;

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedCanteenId) {
            this.form.get('canteen')?.setValue(this.selectedCanteenId);
            this.form.get('canteen')?.updateValueAndValidity();
        }
    }

    getFilter = () => {
        const formValue = this.form.getRawValue();

        let filterValues = {
            canteen: formValue.canteen,
            page: this.currentPage,
            limit: defaultFeeFilter.limit,
            fromDate: formValue.fromDate?.length ? formValue.fromDate : defaultFeeFilter.fromDate,
            toDate: formValue.toDate?.length ? formValue.toDate : defaultFeeFilter.toDate
        };

        return filterValues;
    };

    filterRecord = () => {
        this.currentPage = 1;
        const filterValues = this.getFilter();
        this.filter.emit(filterValues);
    };
}

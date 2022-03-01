import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultCanteenFilter, ICanteenFilter } from '@portal/canteen/models/canteen-filter.model';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-list',
    templateUrl: './canteen-list.component.html',
    styleUrls: ['./canteen-list.component.scss']
})
export class CanteenListComponent extends ComponentBase {
    @Input() canteens: ICanteen[] = [];
    @Input() isSuperAdmin: boolean = false;
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultCanteenFilter.limit || 50;
    @Output() filter = new EventEmitter<ICanteenFilter>();
    @Output() export = new EventEmitter();
    @Output() editCanteen = new EventEmitter<string>();
    @Output() newCanteen = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: ['']
    });
    currentPage = 1;

    constructor(private fb: FormBuilder, private toastr: ToastrService) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: ICanteenFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize
        };

        this.filter.emit(filterValues);
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

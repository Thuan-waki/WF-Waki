import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultCanteenMenuFilter, ICanteenMenu, ICanteenMenuFilter } from '@portal/canteen/models/canteen-menu.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-menu-list',
    templateUrl: './canteen-menu-list.component.html',
    styleUrls: ['./canteen-menu-list.component.scss']
})
export class CanteenMenuListComponent extends ComponentBase implements OnChanges {
    @Input() canteenMenus: ICanteenMenu[] = [];
    @Input() selectedCanteenId: string = '';
    @Input() schoolOptions: any[] = [];
    @Input() canteenOptions: any[] = [];
    @Input() isLoading: boolean = true;
    @Input() isAdmin: boolean = false;
    @Input() isCanteenUser: boolean = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultCanteenMenuFilter.limit || 50;
    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter<ICanteenMenu>();
    @Output() export = new EventEmitter();
    @Output() filter = new EventEmitter<ICanteenMenuFilter>();

    form: FormGroup = this.fb.group({
        search: [''],
        school: [null],
        canteen: [null]
    });

    currentPage = 1;
    imageServerUrl = getImageServerUrl();

    constructor(private fb: FormBuilder) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedCanteenId) {
            this.form.get('canteen')?.setValue(this.selectedCanteenId);
            this.form.get('canteen')?.updateValueAndValidity();
        }
    }

    getFilter = () => {
        let filterValues: ICanteenMenuFilter = {
            search: this.form.get('search')?.value || '',
            page: this.currentPage,
            limit: this.pageSize,
            school: this.form.get('school')?.value || '',
            canteen: this.form.get('canteen')?.value || ''
        };

        return filterValues;
    };

    filterRecord = () => {
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
}

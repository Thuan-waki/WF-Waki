import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultSchoolFilter, ISchoolFilter } from '@portal/school/models/school-filter.model';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-school-list',
    templateUrl: './school-list.component.html',
    styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent extends ComponentBase {
    @Input() schools: ISchool[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultSchoolFilter.limit || 50;
    @Output() filter = new EventEmitter<ISchoolFilter>();
    @Output() export = new EventEmitter();
    @Output() editSchool = new EventEmitter<string>();
    @Output() newSchool = new EventEmitter();

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

        const filterValues: ISchoolFilter = {
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

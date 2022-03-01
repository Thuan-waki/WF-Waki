import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultStudentFilter, IStudentFilter } from '@portal/school/models/student-filter.model';
import { IStudent } from '@portal/school/models/student.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-dependant-list',
    templateUrl: './dependant-list.component.html',
    styleUrls: ['./dependant-list.component.scss']
})
export class DependantListComponent extends ComponentBase {
    @Input() dependants: IStudent[] = [];
    @Input() schoolOptions: any[] = [];
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultStudentFilter.limit || 50;
    @Output() filter = new EventEmitter<IStudentFilter>();
    @Output() export = new EventEmitter();
    @Output() editDependant = new EventEmitter<string>();
    @Output() deleteDependant = new EventEmitter<string>();

    form: FormGroup = this.fb.group({
        search: [''],
        school: [null]
    });
    currentPage = 1;

    constructor(private fb: FormBuilder) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();
        const filterValues: IStudentFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            school: formValue.school || ''
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

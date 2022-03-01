import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultAttendanceFilter, IAttendance, IAttendanceFilter } from '@portal/school/models/attendance.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-attendance-list',
    templateUrl: './attendance-list.component.html',
    styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent extends ComponentBase implements OnChanges {
    @Input() attendances: IAttendance[] = [];
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() isLoading = true;
    @Input() isAdmin = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultAttendanceFilter.limit || 50;
    @Output() filter = new EventEmitter<IAttendanceFilter>();
    @Output() export = new EventEmitter<string>();

    form: FormGroup = this.fb.group({
        search: [''],
        fromDate: [GetDisplayDate(defaultAttendanceFilter.fromDate)],
        toDate: [GetDisplayDate(defaultAttendanceFilter.toDate)],
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.schoolOptions) {
            this.form.get('school')!.setValue(this.schoolOptions[0]?.value || '');
        }
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: IAttendanceFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate),
            school: formValue.school || ''
        };

        this.filter.emit(filterValues);
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    onExportClick = () => {
        const schoolName =
            this.schoolOptions.find((school) => school.value === this.form.get('school')!.value)?.label || '';
        this.export.emit(schoolName);
    };
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';
import { defaultUserFilter, IUser, IUserFilter } from '@portal/shared/models/user.model';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends ComponentBase implements OnInit {
    @Input() users: IUser[] = [];
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultUserFilter.limit || 50;
    @Output() filter = new EventEmitter<IUserFilter>();
    @Output() editUser = new EventEmitter<string>();
    @Output() newUser = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: ['']
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

        const filterValues: IUserFilter = {
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

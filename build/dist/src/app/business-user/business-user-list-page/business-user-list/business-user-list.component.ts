import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';
import { defaultBusinessUserFilter, IUser, IUserFilter } from '@portal/shared/models/user.model';

@Component({
    selector: 'app-business-user-list',
    templateUrl: './business-user-list.component.html',
    styleUrls: ['./business-user-list.component.scss']
})
export class BusinessUserListComponent extends ComponentBase {
    @Input() users: IUser[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = 50;
    @Output() filter = new EventEmitter<IUserFilter>();
    @Output() newUser = new EventEmitter();
    @Output() editUser = new EventEmitter<string>();
    @Output() deleteUser = new EventEmitter<string>();
    @Output() export = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: ['']
    });
    currentPage = 1;

    constructor(private fb: FormBuilder) {
        super();
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: IUserFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            roles: defaultBusinessUserFilter.roles
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

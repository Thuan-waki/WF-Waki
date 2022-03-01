import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultParentFilter, IParent, IParentFilter } from '@portal/adults/models/parent.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-adult-list',
    templateUrl: './adult-list.component.html',
    styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent extends ComponentBase {
    @Input() parents: IParent[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultParentFilter.limit || 50;
    @Output() filter = new EventEmitter<IParentFilter>();
    @Output() editParent = new EventEmitter<string>();
    @Output() export = new EventEmitter();
    @Output() save = new EventEmitter();

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

        const filterValues: IParentFilter = {
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

    editParentStatus = (parent: IParent) => {
        parent.user.isValid = !parent.user?.isValid;
        this.save.emit(parent);
    }
}

import { EventEmitter } from '@angular/core';
import { Component, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultCardOrderFilter, ICardOrderFilter } from '@portal/adults/models/card-order-filter.model';
import { ICardOrder } from '@portal/adults/models/card-order.model';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { CardOrderApprovalDialogComponent } from '../card-order-approval-dialog/card-order-approval-dialog.component';

@Component({
    selector: 'app-card-order-list',
    templateUrl: './card-order-list.component.html',
    styleUrls: ['./card-order-list.component.scss']
})
export class CardOrderListComponent extends ComponentBase {
    @Input() cardOrders: ICardOrder[] = [];
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() isAdmin = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultCardOrderFilter.limit || 50;
    @Output() filter = new EventEmitter<ICardOrderFilter>();
    @Output() export = new EventEmitter();
    @Output() email = new EventEmitter<string>();
    @Output() download = new EventEmitter<string>();

    form: FormGroup = this.fb.group({
        search: [''],
        fromDate: [GetDisplayDate(defaultCardOrderFilter.fromDate)],
        toDate: [GetDisplayDate(defaultCardOrderFilter.toDate)],
        school: [null]
    });
    currentPage = 1;

    constructor(private fb: FormBuilder, public modalService: NgbModal, private toastr: ToastrService) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    filterRecord = () => {
        const formValue = this.form.getRawValue();

        const filterValues: ICardOrderFilter = {
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

    approve = (order: ICardOrder) => {
        const modalRef = this.modalService.open(CardOrderApprovalDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.cardOrderId = order._id;

        modalRef.result
            .then((res) => {
                if (res) {
                    this.toastr.success('Card Approved', 'Card Order');
                    this.filterRecord();
                }
            })
            .catch();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

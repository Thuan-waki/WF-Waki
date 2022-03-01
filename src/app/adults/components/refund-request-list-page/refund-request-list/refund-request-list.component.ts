import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultRefundRequestFilter, IRequestFilter } from '@portal/shared/models/request-filter.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RefundRequestApproveDialogComponent } from '../refund-request-approve-dialog/refund-request-approve-dialog.component';
import { IRequest } from '@portal/shared/models/request.model';

@Component({
    selector: 'app-refund-request-list',
    templateUrl: './refund-request-list.component.html',
    styleUrls: ['./refund-request-list.component.scss']
})
export class RefundRequestListComponent extends ComponentBase {
    @Input() refundRequests: IRequest[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultRefundRequestFilter.limit || 50;
    @Output() filter = new EventEmitter<IRequestFilter>();
    @Output() export = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: [''],
        fromDate: [GetDisplayDate(defaultRefundRequestFilter.fromDate)],
        toDate: [GetDisplayDate(defaultRefundRequestFilter.toDate)]
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

        const filterValues: IRequestFilter = {
            search: formValue.search || '',
            page: this.currentPage,
            limit: this.pageSize,
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate),
            requestType: defaultRefundRequestFilter.requestType
        };

        this.filter.emit(filterValues);
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    approve = (request: IRequest) => {
        const modalRef = this.modalService.open(RefundRequestApproveDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.requestId = request._id;

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

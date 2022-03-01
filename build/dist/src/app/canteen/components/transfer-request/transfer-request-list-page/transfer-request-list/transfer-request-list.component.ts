import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultTransferRequestFilter, IRequestFilter } from '@portal/shared/models/request-filter.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IRequest } from '@portal/shared/models/request.model';
import { RefundRequestApproveDialogComponent } from '@portal/adults/components/refund-request-list-page/refund-request-approve-dialog/refund-request-approve-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-transfer-request-list',
    templateUrl: './transfer-request-list.component.html',
    styleUrls: ['./transfer-request-list.component.scss']
})
export class TransferRequestListComponent extends ComponentBase {
    @Input() transferRequests: IRequest[] = [];
    @Input() canteenId: string = '';
    @Input() isLoading = true;
    @Input() isAdmin = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultTransferRequestFilter.limit || 50;
    @Output() filter = new EventEmitter<IRequestFilter>();
    @Output() export = new EventEmitter();

    form: FormGroup = this.fb.group({
        search: [''],
        fromDate: [GetDisplayDate(defaultTransferRequestFilter.fromDate)],
        toDate: [GetDisplayDate(defaultTransferRequestFilter.toDate)]
    });
    currentPage = 1;
    constructor(private fb: FormBuilder, private toastr: ToastrService, private modalService: NgbModal) {
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
            canteen: this.canteenId,
            requestType: defaultTransferRequestFilter.requestType,
            fromDate: new Date(formValue.fromDate),
            toDate: new Date(formValue.toDate)
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

        modalRef.componentInstance.dialogTitle = 'Canteen Transfer Request';
        modalRef.componentInstance.requestId = request._id;

        modalRef.result
            .then((res) => {
                if (res) {
                    this.toastr.success('Transfer Approved', 'Transfer');
                    this.filterRecord();
                }
            })
            .catch();
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RefundRequestService } from '@portal/adults/services/refund-request.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-refund-request-approve-dialog',
    templateUrl: './refund-request-approve-dialog.component.html',
    styleUrls: ['./refund-request-approve-dialog.component.scss']
})
export class RefundRequestApproveDialogComponent extends ComponentBase {
    @Input() requestId: string = '';
    @Input() dialogTitle: string = 'Refund Parent Request';
    isLoading = false;

    constructor(
        private activeModal: NgbActiveModal,
        private refundRequestService: RefundRequestService,
        private toastr: ToastrService
    ) {
        super();
    }

    close = () => {
        this.activeModal.close();
    };

    approve = () => {
        this.isLoading = true;
        this.refundRequestService
            .updateStatus(this.requestId)
            .pipe(
                tap((result: IApiResult) => {
                    this.activeModal.close(true);
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error(`Failed to approve ${this.dialogTitle}`, 'Card Order');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };
}

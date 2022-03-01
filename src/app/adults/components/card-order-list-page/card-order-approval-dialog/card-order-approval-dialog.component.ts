import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CardOrderService } from '@portal/adults/services/card-order.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-card-order-approval-dialog',
    templateUrl: './card-order-approval-dialog.component.html',
    styleUrls: ['./card-order-approval-dialog.component.scss']
})
export class CardOrderApprovalDialogComponent extends ComponentBase {
    @Input() cardOrderId: string = '';
    isLoading = false;

    form: FormGroup = this.fb.group({
        cardId: ['', [Validators.required]],
        cardSerialNo: ['', [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private cardOrderService: CardOrderService,
        private toastr: ToastrService
    ) {
        super();
    }

    close = () => {
        this.activeModal.close();
    };

    approve = () => {
        if (!this.form.valid) {
            return;
        }

        this.isLoading = true;

        const formValue = this.form.getRawValue();

        this.cardOrderService
            .approveCard(this.cardOrderId, formValue.cardId, formValue.cardSerialNo)
            .pipe(
                tap((result: IApiResult) => {
                    this.activeModal.close(true);
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error('Faled to approve Card Order', 'Card Order');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    get shouldDisableApproveButton() {
        return !this.form.valid;
    }
}

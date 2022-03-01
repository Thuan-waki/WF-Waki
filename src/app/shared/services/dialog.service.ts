import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DialogType } from '../enums/dialog-type.enum';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private modalService: NgbModal) {}

    confirm(
        title: string,
        message: string,
        buttonText: string = 'Confirm',
        cancelButtonText: string = 'Cancel',
        dialogType: DialogType = DialogType.Default
    ) {
        const modalRef = this.modalService.open(ConfirmDialogComponent, {
            backdrop: 'static',
            keyboard: false
        });

        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.buttonText = buttonText;
        modalRef.componentInstance.cancelButtonText = cancelButtonText;
        modalRef.componentInstance.dialogType = dialogType;

        return from(modalRef.result);
    }
}

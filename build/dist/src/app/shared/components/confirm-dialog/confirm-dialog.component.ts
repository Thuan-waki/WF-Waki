import { Component, Input } from '@angular/core';

// Other
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogType } from 'src/app/shared/enums/dialog-type.enum';
import { ComponentBase } from '../component-base';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends ComponentBase {
    @Input() public title: string = 'Confirm';
    @Input() public message: string = 'Are you sure?';
    @Input() public buttonText = 'Confirm';
    @Input() public cancelButtonText = 'Cancel';
    @Input() dialogType = DialogType.Default;

    DialogType = DialogType;

    constructor(private activeModal: NgbActiveModal) {
        super();
    }

    cancel() {
        this.activeModal.close(false);
    }

    continue() {
        this.activeModal.close(true);
    }
}

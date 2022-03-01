import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-sign-up-info-dialog',
    templateUrl: './sign-up-info-dialog.component.html',
    styleUrls: ['./sign-up-info-dialog.component.scss']
})
export class SignUpInfoDialogComponent {
    constructor(private activeModal: NgbActiveModal, private router: Router) {}

    close = () => {
        this.activeModal.close();
    };

    proceed = () => {
        this.router.navigateByUrl('business-sign-up');
        this.close();
    };
}

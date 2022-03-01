import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-canteen-sign-up-otp-form',
    templateUrl: './canteen-sign-up-otp-form.component.html',
    styleUrls: ['./canteen-sign-up-otp-form.component.scss']
})
export class CanteenSignUpOtpFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() error: string = '';
    @Input() shouldDisableVerifyButton = true;
    @Input() isLoading: boolean = false;
    @Output() verify = new EventEmitter();
    @Output() back = new EventEmitter();

    constructor() {}
}

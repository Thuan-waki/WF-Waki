import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';

@Component({
    selector: 'app-otp-login-form',
    templateUrl: './otp-login-form.component.html',
    styleUrls: ['./otp-login-form.component.scss']
})
export class OtpLoginFormComponent extends ComponentBase {
    @Input() form: FormGroup | undefined;
    @Input() disableVerifyButton: boolean = true;
    @Input() isLoading: boolean = false;
    @Input() error: string = '';
    @Output() verify = new EventEmitter();

    constructor() {
        super();
    }
}

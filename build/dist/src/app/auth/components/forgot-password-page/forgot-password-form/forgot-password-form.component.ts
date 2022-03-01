import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-forgot-password-form',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() isLoading: boolean = false;
    @Input() currentStep: number = 1;
    @Input() notValid: boolean = false;
    @Output() stepOneClick = new EventEmitter();
    @Output() stepTwoClick = new EventEmitter();
    @Output() stepThreeClick = new EventEmitter();

    constructor() {}
}

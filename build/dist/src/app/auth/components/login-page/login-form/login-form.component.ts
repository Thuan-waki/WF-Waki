import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends ComponentBase implements OnInit {
    @Input() form!: FormGroup;
    @Input() disableLoginButton: boolean = true;
    @Input() isLoading: boolean = false;
    @Input() error: string = '';
    @Output() login = new EventEmitter();
    @Output() goToForgotPassword = new EventEmitter();

    constructor() {
        super();
    }
}

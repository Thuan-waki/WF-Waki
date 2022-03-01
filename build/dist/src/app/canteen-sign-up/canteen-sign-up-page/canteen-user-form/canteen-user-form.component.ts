import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-canteen-user-form',
    templateUrl: './canteen-user-form.component.html',
    styleUrls: ['./canteen-user-form.component.scss']
})
export class CanteenUserFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() isLoading: boolean = true;
    @Input() shouldDisableSignUpButton: boolean = true;
    @Output() cancel = new EventEmitter();
    @Output() signUp = new EventEmitter();

    get translations() {
        return this.form?.get('translations') as FormGroup;
    }

    constructor() {}
}

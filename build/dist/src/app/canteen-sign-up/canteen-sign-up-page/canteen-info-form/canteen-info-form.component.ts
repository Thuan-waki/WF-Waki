import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISelectOption } from '@portal/shared/models/select-option.model';

@Component({
    selector: 'app-canteen-info-form',
    templateUrl: './canteen-info-form.component.html',
    styleUrls: ['./canteen-info-form.component.scss']
})
export class CanteenInfoFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() error: string = '';
    @Input() shouldDisableSubmitButton = true;
    @Input() isLoading: boolean = false;
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() cityOptions: ISelectOption[] = [];
    @Input() countryOptions: ISelectOption[] = [];
    @Output() submitCanteen = new EventEmitter();
    @Output() back = new EventEmitter();

    get translations() {
        return this.form?.get('translations') as FormGroup;
    }

    constructor() {}
}

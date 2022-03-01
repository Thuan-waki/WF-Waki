import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-input-required-error-message',
    templateUrl: './input-required-error-message.component.html',
    styleUrls: ['./input-required-error-message.component.scss']
})
export class InputRequiredErrorMessageComponent {
    @Input() message: string = 'Required';
    @Input() control: AbstractControl | undefined;

    constructor() {}
}

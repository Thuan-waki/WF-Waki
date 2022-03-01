import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-cancel-button',
    templateUrl: './cancel-button.component.html',
    styleUrls: ['./cancel-button.component.scss']
})
export class CancelButtonComponent {
    @Input() disabled: boolean = false;
    @Input() text: string = 'Cancel';
    @Output() cancel = new EventEmitter();

    constructor() {}
}

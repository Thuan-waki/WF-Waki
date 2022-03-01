import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-add-button',
    templateUrl: './add-button.component.html',
    styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
    @Input() disabled: boolean = false;
    @Input() text: string = 'Add';
    @Input() icon: IconDefinition = faPlus;
    @Input() showIcon: Boolean = true;
    @Input() customClass: string = '';
    @Output() cancel = new EventEmitter();

    constructor() {}
}

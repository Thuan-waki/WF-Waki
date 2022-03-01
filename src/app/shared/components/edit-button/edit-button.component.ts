import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-edit-button',
    templateUrl: './edit-button.component.html',
    styleUrls: ['./edit-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditButtonComponent {
    @Input() disabled: boolean = false;
    @Input() text: string = 'Edit';
    @Input() icon: IconDefinition = faEdit;
    @Input() showIcon: boolean = true;
    @Output() cancel = new EventEmitter();

    faEdit = faEdit;

    constructor() {}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-save-button',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveButtonComponent {
    @Input() disabled: boolean = false;
    @Input() icon: IconDefinition = faSave;
    @Input() showIcon: boolean = true;
    @Input() text = 'Save';
    @Output() save = new EventEmitter();

    constructor() {}
}

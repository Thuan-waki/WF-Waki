import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-exit-button',
    templateUrl: './exit-button.component.html',
    styleUrls: ['./exit-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExitButtonComponent {
    @Input() disabled: boolean = false;
    @Input() icon: IconDefinition = faTimes;
    @Input() showIcon: boolean = true;
    @Input() text = 'Exit';
    @Output() exit = new EventEmitter();

    constructor() {}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-export-button',
    templateUrl: './export-button.component.html',
    styleUrls: ['./export-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportButtonComponent {
    @Input() text: string = 'Export';
    @Input() disabled: boolean = false;
    @Output() export = new EventEmitter();

    constructor() {}
}

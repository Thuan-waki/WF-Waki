import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-class-form',
    templateUrl: './class-form.component.html',
    styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() schoolOptions: any = [];
    @Input() isLoading: boolean = true;
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() isEditing = false;
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();

    constructor() {}
}

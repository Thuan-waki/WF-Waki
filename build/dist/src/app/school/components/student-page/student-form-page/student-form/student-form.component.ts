import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IParent } from '@portal/school/models/parent.model';
import { genderOptions } from '@portal/shared/constants/gender';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';

@Component({
    selector: 'app-student-form',
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() parent: IParent | undefined;
    @Input() isLoading: boolean = true;
    @Input() isEditing: boolean = false;
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() isTogglingCardStatus: boolean = false;
    @Input() cardStatus: 'ACTIVE' | 'INACTIVE' | undefined;
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() gradeOptions: ISelectOption[] = [];
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();
    @Output() toggleCardStatus = new EventEmitter<string>();
    @Output() schoolChanged = new EventEmitter();

    genderOptions = genderOptions.map((g) => ({ value: g.value, label: translationLang(g.translations)}));

    constructor() {}
}

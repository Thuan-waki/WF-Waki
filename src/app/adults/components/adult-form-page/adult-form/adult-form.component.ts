import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IParent } from '@portal/adults/models/parent.model';
import { genderOptions } from '@portal/shared/constants/gender';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { translationLang } from '@portal/shared/functions/translate-language';

@Component({
    selector: 'app-adult-form',
    templateUrl: './adult-form.component.html',
    styleUrls: ['./adult-form.component.scss']
})
export class AdultFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() parent: IParent | undefined;
    @Input() isLoading: boolean = true;
    @Input() isEditing: boolean = false;
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() cardStatus: 'ACTIVE' | 'INACTIVE' | undefined;
    @Input() isTogglingCardStatus: boolean = false;
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();
    @Output() editChild = new EventEmitter<string>();
    @Output() toggleCardStatus = new EventEmitter<string>();

    genderOptions = genderOptions.map((g) => ({ value: g.value, label: translationLang(g.translations) }));
    imageUrl = getImageServerUrl();

    get translations() {
        return this.form?.get('translations') as FormGroup;
    }

    constructor() {}
}

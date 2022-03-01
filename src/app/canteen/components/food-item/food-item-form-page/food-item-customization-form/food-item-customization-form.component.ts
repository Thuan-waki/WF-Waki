import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { translationLang } from '@portal/shared/functions/translate-language';

const selectedOptions = [
    {
        value: 'SINGLE_CHOICE',
        translations: {
            en: 'Single Select',
            ar: 'تيار واحد'
        }
    },
    {
        value: 'MULTI_CHOICE',
        translations: {
            en: 'Multi Select',
            ar: 'يارات متعددة'
        }
    }
];

@Component({
    selector: 'app-food-item-customization-form',
    templateUrl: './food-item-customization-form.component.html',
    styleUrls: ['./food-item-customization-form.component.scss']
})
export class FoodItemCustomizationFormComponent {
    @Input() form!: FormArray;
    @Output() addCustomizationOption = new EventEmitter<number>();
    @Output() remove = new EventEmitter<number>();
    @Output() removeOption = new EventEmitter<{ customizationIndex: number; optionIndex: number }>();

    customization = (i: number) => this.form.controls[i] as FormGroup;
    options = (i: number) => this.customization(i).get('options') as FormArray;

    typeSelect = selectedOptions.map((s) => ({value: s.value, label: translationLang(s.translations)}));

    constructor() {}

    emitRemoveOption = (customizationIndex: number, optionIndex: number) => {
        this.removeOption.emit({ customizationIndex: customizationIndex, optionIndex: optionIndex });
    };
}

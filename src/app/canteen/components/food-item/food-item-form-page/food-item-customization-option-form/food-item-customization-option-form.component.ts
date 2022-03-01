import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { booleanOptions } from '@portal/shared/constants/booleanOptions';
import { translationLang } from '@portal/shared/functions/translate-language';

@Component({
    selector: 'app-food-item-customization-option-form',
    templateUrl: './food-item-customization-option-form.component.html',
    styleUrls: ['./food-item-customization-option-form.component.scss']
})
export class FoodItemCustomizationOptionFormComponent {
    @Input() form!: FormArray;
    @Output() add = new EventEmitter();
    @Output() remove = new EventEmitter<number>();

    option = (i: number) => this.form.controls[i] as FormGroup;
    extraPrice = (i: number) => this.option(i).get('extraPrice') as FormControl;

    hasExtraPriceOption = booleanOptions.map((opt) => ({ value: opt.value, label: translationLang(opt.translations)}));

    constructor() {}

    onHasExtraPriceChange = (event: any, index: number) => {
        if (!event.value) {
            this.extraPrice(index).disable();
        } else {
            this.extraPrice(index).enable();
        }

        this.form.updateValueAndValidity();
    };
}

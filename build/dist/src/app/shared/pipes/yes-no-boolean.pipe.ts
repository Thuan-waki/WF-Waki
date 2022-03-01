import { Pipe, PipeTransform } from '@angular/core';
import { booleanOptions } from '../constants/booleanOptions';
import { translationLang } from '../functions/translate-language';

@Pipe({ name: 'yesNoBoolean', pure: false })
export class YesNoBooleanPipe implements PipeTransform {
    constructor() {}

    transform(value: boolean | undefined) {
        const opts = booleanOptions.map((opt) => ({ value: opt.value, label: translationLang(opt.translations)}));
        return opts.find((opt) => opt.value === value)?.label || 'No';
    }
}

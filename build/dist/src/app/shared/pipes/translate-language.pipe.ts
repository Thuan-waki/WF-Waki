import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'translation', pure: false })
export class TranslationPipe implements PipeTransform {
    constructor() { }

    transform(value: any): string {
        const transObj = Array.isArray(value) ? value[0]?.translations : value;

        if (!transObj) {
            return '';
        }

        return sessionStorage.getItem('lang') === 'ar' ? transObj.ar : transObj.en;
    }
}
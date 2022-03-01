import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'wakiCurrency', pure: false })
export class WakiCurrencyPipe extends CurrencyPipe implements PipeTransform {
    transform(value: any, currencyCode = ' SAR', display?: any, digitsInfo: string = '1.2-2'): any {
        return value && value.toString().length ? super.transform(value, '', '', digitsInfo) + currencyCode : '0.00';
    }
}

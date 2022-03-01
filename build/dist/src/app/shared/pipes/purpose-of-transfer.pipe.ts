import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'purposeOfTransfer', pure: false })
export class PurposeOfTransferPipe implements PipeTransform {
    transform(value: string | null): string | null {
        const types: any = {
            ['FAMILY_AND_FRIENDS']: 'Family and Friends',
            ['ITEM_PURCHASES']: 'Item purchases',
            ['EDUCATIONAL']: 'Educational'
        };

        return types[value || 'default'];
    }
}

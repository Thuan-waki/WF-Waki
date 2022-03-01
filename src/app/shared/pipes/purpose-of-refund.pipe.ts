import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'purposeOfRefund', pure: false })
export class PurposeOfRefundPipe implements PipeTransform {
    transform(value: string | null): string | null {
        const types: any = {
            ['SAVING']: 'Saving',
            ['FAMILY_EXPENSES']: 'Family expenses',
            ['TREATMENT_EXPENSES']: 'Treatment Expenses',
            ['INVESTMENT']: 'Investment',
            ['PERSONAL_REMITTANCES']: 'Personal remittances',
            ['PAYMENT_DUES']: 'Payment dues',
            ['PURCHASING']: 'Purchasing',
            ['CHARITY']: 'Charity',
            ['OTHERS']: 'Others'
        };

        return types[value || 'default'];
    }
}

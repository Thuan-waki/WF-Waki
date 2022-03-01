import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'transactionType', pure: false })
export class TransactionTypePipe implements PipeTransform {
    transform(value: string | null): string | null {
        const types: any = {
            ['WALK_IN_FOOD_ORDER']: 'Walk-in Order',
            ['APP_FOOD_ORDER']: 'Online Order',
            ['COUPON_PURCHASE']: 'Coupons Order',
            ['TRANSFER_TO_CANTEEN']: 'Transfer to Canteen',
            ['TRANSFER_BETWEEN_USERS']: 'Transfer',
            ['WAKI_COUPON_FEE']: 'Coupon Fee',
            ['VAT']: 'VAT',
            ['ADULT_VAT']: 'VAT',
            ['FUNDING']: 'Fund',
            ['CARD_ORDER']: 'Card Order',
            ['RETURN_ORDER']: 'Return',
            ['REFUNDING']: 'Refund',
            ['TRANSFER_FEE']: 'Transaction Fee',
            ['DEFAULT']: ''
        };

        return types[value || 'default'];
    }
}

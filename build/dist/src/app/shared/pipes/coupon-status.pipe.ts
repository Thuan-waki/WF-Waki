import { Pipe, PipeTransform } from '@angular/core';
import { translationLang } from '../functions/translate-language';
const typeOpts = [
    {
        value: 'REJECTED',
        translations: {
            en: 'Rejected',
            ar: 'تم الاسترجاع'
        }
    },
    {
        value: 'PENDING',
        translations: {
            en: 'Pending',
            ar: 'معلق'
        }
    },
    {
        value: 'APPROVED',
        translations: {
            en: 'Approved',
            ar: 'موافقة'
        }
    }
]

@Pipe({ name: 'couponStatus', pure: false })
export class CouponStatusPipe implements PipeTransform {
    transform(value: string | null): string | null {
        const result = typeOpts.find((opt) => opt.value === value)?.translations;

        return translationLang(result);
    }
}

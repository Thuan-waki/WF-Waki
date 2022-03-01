import { Pipe, PipeTransform } from '@angular/core';
import { ITransactionExternalPaymentObjectSource } from '@portal/canteen/models/transaction.model';
@Pipe({ name: 'payment', pure: false })
export class PaymentPipe implements PipeTransform {
    transform(source: ITransactionExternalPaymentObjectSource | undefined): string {
        if (!source) {
            return '';
        }

        const payment = source?.type;
        const company = source?.company;

        if (!payment || !payment?.length || !company || !company.length) {
            return '';
        }

        if (payment === 'creditcard') {
            if (company === 'mada') {
                return 'Mada';
            }

            if (company === 'master') {
                return 'master';
            }

            if (company === 'visa') {
                return 'Visa';
            }
        }

        if (payment === 'applepay') {
            if (company === 'visa') {
                return 'Apple Pay - Visa';
            }

            if (company === 'master') {
                return 'Apple Pay - Master';
            }

            if (company === 'mada') {
                return 'Apple Pay - Mada';
            }
        }

        if (payment === 'stcpay') {
            if (company === 'stc') {
                return 'STC PAY';
            }
        }

        return source?.type || '';
    }
}

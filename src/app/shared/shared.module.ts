import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { WakiDatePipe } from './pipes/waki-date.pipe';
import { SharedComponentModule } from './components/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WakiCurrencyPipe } from './pipes/waki-currency.pipe';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { YesNoBooleanPipe } from './pipes/yes-no-boolean.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CouponStatusPipe } from './pipes/coupon-status.pipe';
import { ShortenPipe } from './pipes/shorten.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { PurposeOfRefundPipe } from './pipes/purpose-of-refund.pipe';
import { PurposeOfTransferPipe } from './pipes/purpose-of-transfer.pipe';
import { WakiTimePipe } from './pipes/waki-time.pipe';
import { PaymentPipe } from './pipes/payment.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationPipe } from './pipes/translate-language.pipe';
import { LanguageTxtPipe } from './pipes/language.pipe';

const PIPES = [
    WakiDatePipe,
    WakiTimePipe,
    WakiCurrencyPipe,
    YesNoBooleanPipe,
    TransactionTypePipe,
    CouponStatusPipe,
    ShortenPipe,
    GenderPipe,
    PurposeOfRefundPipe,
    PurposeOfTransferPipe,
    PaymentPipe,
    TranslationPipe,
    LanguageTxtPipe
];

@NgModule({
    imports: [
        CommonModule,
        SharedComponentModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        FontAwesomeModule,
        NgbModule,
        BreadcrumbModule,
        TranslateModule.forChild()
    ],
    declarations: [...PIPES],
    exports: [...PIPES, ReactiveFormsModule, NgSelectModule, FontAwesomeModule, BreadcrumbModule, TranslateModule],
    providers: [
        DatePipe,
        CurrencyPipe,
        WakiDatePipe,
        WakiTimePipe,
        WakiCurrencyPipe,
        YesNoBooleanPipe,
        CouponStatusPipe,
        ShortenPipe,
        GenderPipe,
        TransactionTypePipe,
        PurposeOfRefundPipe,
        PurposeOfTransferPipe,
        DecimalPipe,
        PaymentPipe,
        BreadcrumbService,
        TranslateService
    ]
})
export class SharedModule {}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentBase } from '@portal/shared/components/component-base';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';

@Component({
    selector: 'app-coupon-form',
    templateUrl: './coupon-form.component.html',
    styleUrls: ['./coupon-form.component.scss']
})
export class CouponFormComponent extends ComponentBase implements OnChanges {
    @Input() form: FormGroup | undefined;
    @Input() schoolOptions: any = [];
    @Input() isLoading: boolean = true;
    @Input() isEditing: boolean = false;
    @Input() shouldDisableSaveButton: boolean = true;
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();

    getCreditAvail = () => this.form?.get('creditAvail') as FormControl;
    getSaveAmount = () => this.form?.get('saveAmount') as FormControl;
    getCouponPrice = () => this.form?.get('couponPrice') as FormControl;

    constructor() {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.form) {
            if (this.form) {
                this.getCreditAvail().valueChanges.subscribe(() => this.calculateCouponPrice());
                this.getCouponPrice().valueChanges.subscribe(() => this.calculateCouponPrice());
            }
        }
    }

    calculateCouponPrice = () => {
        this.getSaveAmount().setValue(+this.getCreditAvail().value - +this.getCouponPrice().value || 0);
    };
}

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IFoodOrder, IFoodOrderItem, IFoodOrderSelectedCustomization } from '@portal/canteen/models/food-order.model';
import { InvoiceService } from '@portal/canteen/services/invoice.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-food-order-detail-dialog',
    templateUrl: './food-order-detail-dialog.component.html',
    styleUrls: ['./food-order-detail-dialog.component.scss']
})
export class FoodOrderDetailDialogComponent extends ComponentBase {
    @Input() orderId: string = '';
    @Input() foodOrder!: IFoodOrder;
    @Input() items: IFoodOrderItem[] = [];
    @Input() returnItems: IFoodOrderItem[] = [];

    isDownloading: boolean = false;
    isSendingEmail: boolean = false;

    constructor(
        private activeModal: NgbActiveModal,
        private invoiceService: InvoiceService,
        private toastr: ToastrService
    ) {
        super();
    }

    generateCustomizations = (customizations: IFoodOrderSelectedCustomization[]) => {
        let customizationText = '';

        (customizations || []).forEach((customization) => {
            customizationText = `${customizationText}${translationLang(customization?.customization?.translations)}`;

            if (customization.values && customization.values?.length) {
                const optionTexts = customization.values.map((value) => translationLang(value.option?.translations));
                customizationText = `${customizationText}, options: ${optionTexts.join(', ')}<br />`;
            } else {
                customizationText = `${customizationText}<br />`;
            }
        });

        return customizationText;
    };

    close = () => {
        this.activeModal.close();
    };

    calculateCustomizationTotalPrice = (customizations: IFoodOrderSelectedCustomization[]): number => {
        let total = 0;

        for (let customization of customizations) {
            for (let value of customization.values) {
                total += value.price;
            }
        }

        return total;
    };

    getInvoice = async () => {
        this.isDownloading = true;
        this.invoiceService
            .getInvoice(this.foodOrder.invoice?.invoiceNo || '')
            .pipe(
                tap((res: Blob) => {
                    const downloadUrl = window.URL.createObjectURL(res);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${this.foodOrder.invoice?.invoiceNo}.pdf`;
                    link.click();
                    this.isDownloading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isDownloading = false;
                    this.toastr.error('Failed to download invoice', 'Invoice Download');
                    return of();
                })
            )
            .subscribe();
    };

    emailInvoice = () => {
        this.isSendingEmail = true;

        this.invoiceService
            .email(this.foodOrder.invoice?.invoiceNo || '')
            .pipe(
                tap(() => {
                    this.isSendingEmail = false;
                    this.toastr.success('Email Sent', 'Email');
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isSendingEmail = false;
                    this.toastr.error('Failed to send email', 'Email Invoice');
                    return of();
                })
            )
            .subscribe();
    };

    get isReturnOrder() {
        return this.orderId.includes('KR');
    }

    get isReturnOrderOnly() {
        return this.orderId.includes('KR');
    }
}

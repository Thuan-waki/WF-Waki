import { NgModule } from '@angular/core';

import { AdultRoutingModule } from './adult-routing.module';
import { AdultPageComponent } from './components/adult-page.component';
import { AdultListPageComponent } from './components/adult-list-page/adult-list-page.component';
import { AdultListComponent } from './components/adult-list-page/adult-list/adult-list.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';
import { CardOrderListPageComponent } from './components/card-order-list-page/card-order-list-page.component';
import { CardOrderListComponent } from './components/card-order-list-page/card-order-list/card-order-list.component';
import { CardOrderApprovalDialogComponent } from './components/card-order-list-page/card-order-approval-dialog/card-order-approval-dialog.component';
import { CommonModule } from '@angular/common';
import { RefundRequestListPageComponent } from './components/refund-request-list-page/refund-request-list-page.component';
import { RefundRequestListComponent } from './components/refund-request-list-page/refund-request-list/refund-request-list.component';
import { RefundRequestApproveDialogComponent } from './components/refund-request-list-page/refund-request-approve-dialog/refund-request-approve-dialog.component';
import { AdultFormPageComponent } from './components/adult-form-page/adult-form-page.component';
import { AdultFormComponent } from './components/adult-form-page/adult-form/adult-form.component';
import { AdultTransactionListPageComponent } from './components/adult-transaction-list-page/adult-transaction-list-page.component';
import { AdultTransactionListComponent } from './components/adult-transaction-list-page/adult-transaction-list/adult-transaction-list.component';
import { CardStorePageComponent } from './components/card-store-page/card-store-page.component';
import { CardStoreListPageComponent } from './components/card-store-page/card-store-list-page/card-store-list-page.component';
import { CardStoreListComponent } from './components/card-store-page/card-store-list-page/card-store-list/card-store-list.component';
import { CardFormPageComponent } from './components/card-store-page/card-form-page/card-form-page.component';
import { CardFormComponent } from './components/card-store-page/card-form-page/card-form/card-form.component';

const COMPONENTS = [
    AdultPageComponent,
    AdultListPageComponent,
    AdultListComponent,
    CardOrderListPageComponent,
    CardOrderListComponent,
    CardOrderApprovalDialogComponent,
    RefundRequestListPageComponent,
    RefundRequestListComponent,
    RefundRequestApproveDialogComponent,
    AdultFormPageComponent,
    AdultFormComponent,
    AdultTransactionListPageComponent,
    AdultTransactionListComponent,
    CardStorePageComponent,
    CardStoreListPageComponent,
    CardStoreListComponent,
    CardFormPageComponent,
    CardFormComponent
];

@NgModule({
    imports: [CommonModule, AdultRoutingModule, SharedModule, SharedComponentModule],
    declarations: [COMPONENTS],
    exports: [COMPONENTS]
})
export class AdultModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdultFormPageComponent } from './components/adult-form-page/adult-form-page.component';
import { AdultListPageComponent } from './components/adult-list-page/adult-list-page.component';
import { AdultPageComponent } from './components/adult-page.component';
import { AdultTransactionListPageComponent } from './components/adult-transaction-list-page/adult-transaction-list-page.component';
import { CardOrderListPageComponent } from './components/card-order-list-page/card-order-list-page.component';
import { CardStoreListPageComponent } from './components/card-store-page/card-store-list-page/card-store-list-page.component';
import { CardFormPageComponent } from './components/card-store-page/card-form-page/card-form-page.component';
import { CardStorePageComponent } from './components/card-store-page/card-store-page.component';
import { RefundRequestListPageComponent } from './components/refund-request-list-page/refund-request-list-page.component';

const routes: Routes = [
    {
        path: '',
        component: AdultPageComponent,
        data: { breadcrumb: { label: 'Adults' } },
        children: [
            {
                path: '',
                component: AdultListPageComponent
            },
            {
                path: 'form',
                component: AdultFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'form/:id',
                component: AdultFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'card-orders',
                component: CardOrderListPageComponent,
                data: { breadcrumb: { label: 'Card Orders' } }
            },
            {
                path: 'refund-requests',
                component: RefundRequestListPageComponent,
                data: { breadcrumb: { label: 'Refund Requests' } }
            },
            {
                path: 'transactions',
                component: AdultTransactionListPageComponent,
                data: { breadcrumb: { label: 'Transactions' } }
            },
            {
                path: 'card-store',
                component: CardStorePageComponent,
                data: { breadcrumb: { label: 'Card Store' } },
                children: [
                    {
                        path: '',
                        component: CardStoreListPageComponent
                    },
                    {
                        path: 'form',
                        component: CardFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } },
                    },
                    {
                        path: 'form/:id',
                        component: CardFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } },
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdultRoutingModule { }

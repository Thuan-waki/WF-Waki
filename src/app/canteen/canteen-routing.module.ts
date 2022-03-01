import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanteenPageComponent } from './canteen-page.component';
import { CanteenFormPageComponent } from './components/canteen-form-page/canteen-form-page.component';
import { CanteenListPageComponent } from './components/canteen-list-page/canteen-list-page.component';
import { CanteenMenuFormPageComponent } from './components/canteen-menu/canteen-menu-form-page/canteen-menu-form-page.component';
import { CanteenMenuListPageComponent } from './components/canteen-menu/canteen-menu-list-page/canteen-menu-list-page.component';
import { CanteenMenuPageComponent } from './components/canteen-menu/canteen-menu-page.component';
import { CouponOrderListPageComponent } from './components/coupon-page/coupon-order-list-page/coupon-order-list-page.component';
import { CouponFormPageComponent } from './components/coupon-page/coupon-form-page/coupon-form-page.component';
import { CouponListPageComponent } from './components/coupon-page/coupon-list-page/coupon-list-page.component';
import { CouponPageComponent } from './components/coupon-page/coupon-page.component';
import { FoodItemFormPageComponent } from './components/food-item/food-item-form-page/food-item-form-page.component';
import { FoodItemListPageComponent } from './components/food-item/food-item-list-page/food-item-list-page.component';
import { FoodItemPageComponent } from './components/food-item/food-item-page.component';
import { FoodOrderListPageComponent } from './components/food-order/food-order-list-page/food-order-list-page.component';
import { FoodOrderPageComponent } from './components/food-order/food-order-page.component';
import { TransactionPageComponent } from './components/transactions/transaction-page.component';
import { TransferRequestListPageComponent } from './components/transfer-request/transfer-request-list-page/transfer-request-list-page.component';
import { TransferRequestPageComponent } from './components/transfer-request/transfer-request-page.component';

const routes: Routes = [
    {
        path: '',
        component: CanteenPageComponent,
        data: { breadcrumb: { label: 'Canteens' } },
        children: [
            {
                path: '',
                component: CanteenListPageComponent
            },
            {
                path: 'form',
                component: CanteenFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'form/:id',
                component: CanteenFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'transactions',
                component: TransactionPageComponent,
                data: { breadcrumb: { label: 'Transactions' } }
            },
            {
                path: 'canteen-menu',
                component: CanteenMenuPageComponent,
                data: { breadcrumb: { label: 'Food Menu' } },
                children: [
                    {
                        path: '',
                        component: CanteenMenuListPageComponent
                    },
                    {
                        path: 'form',
                        component: CanteenMenuFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    }
                ]
            },
            {
                path: 'food-items',
                component: FoodItemPageComponent,
                data: { breadcrumb: { label: 'Food Items' } },
                children: [
                    {
                        path: '',
                        component: FoodItemListPageComponent
                    },
                    {
                        path: 'form',
                        component: FoodItemFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    },
                    {
                        path: 'form/:id',
                        component: FoodItemFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    }
                ]
            },
            {
                path: 'food-orders',
                component: FoodOrderPageComponent,
                data: { breadcrumb: { label: 'Food Orders' } },
                children: [
                    {
                        path: '',
                        component: FoodOrderListPageComponent,
                        data: { route: 'Food Order List' }
                    }
                ]
            },
            {
                path: 'transfer-request',
                component: TransferRequestPageComponent,
                data: { breadcrumb: { label: 'Transfer Requests' } },
                children: [
                    {
                        path: '',
                        component: TransferRequestListPageComponent
                    }
                ]
            },
            {
                path: 'coupons',
                component: CouponPageComponent,
                data: { breadcrumb: { label: 'Coupons' } },
                children: [
                    {
                        path: '',
                        component: CouponListPageComponent
                    },
                    {
                        path: 'form',
                        component: CouponFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    },
                    {
                        path: 'form/:id',
                        component: CouponFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    },
                    {
                        path: 'order',
                        component: CouponOrderListPageComponent,
                        data: { breadcrumb: { label: 'Coupon Orders' } }
                    }
                ]
            },
            {
                path: 'fee',
                loadChildren: () => import('../fee/fee.module').then((m) => m.FeeModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CanteenRoutingModule {}

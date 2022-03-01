import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanteenRoutingModule } from './canteen-routing.module';
import { CanteenPageComponent } from './canteen-page.component';
import { TransactionListComponent } from './components/transactions/transactions/transaction-list/transaction-list.component';
import { TransactionPageComponent } from './components/transactions/transaction-page.component';
import { SharedModule } from '@portal/shared/shared.module';
import { FoodItemFormComponent } from './components/food-item/food-item-form-page/food-item-form/food-item-form.component';
import { FoodItemListComponent } from './components/food-item/food-item-list-page/food-item-list/food-item-list.component';
import { FoodItemPageComponent } from './components/food-item/food-item-page.component';
import { CanteenMenuPageComponent } from './components/canteen-menu/canteen-menu-page.component';
import { CanteenMenuListComponent } from './components/canteen-menu/canteen-menu-list-page/canteen-menu-list/canteen-menu-list.component';
import { CanteenMenuFormComponent } from './components/canteen-menu/canteen-menu-form-page/canteen-menu-form/canteen-menu-form.component';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';
import { FoodItemFormPageComponent } from './components/food-item/food-item-form-page/food-item-form-page.component';
import { FoodItemListPageComponent } from './components/food-item/food-item-list-page/food-item-list-page.component';
import { FoodItemCustomizationFormComponent } from './components/food-item/food-item-form-page/food-item-customization-form/food-item-customization-form.component';
import { FoodItemCustomizationOptionFormComponent } from './components/food-item/food-item-form-page/food-item-customization-option-form/food-item-customization-option-form.component';
import { CanteenMenuListPageComponent } from './components/canteen-menu/canteen-menu-list-page/canteen-menu-list-page.component';
import { CanteenMenuFormPageComponent } from './components/canteen-menu/canteen-menu-form-page/canteen-menu-form-page.component';
import { CanteenMenuFoodItemPickListComponent } from './components/canteen-menu/canteen-menu-form-page/canteen-menu-food-item-pick-list/canteen-menu-food-item-pick-list.component';
import { CanteenMenuFoodItemPickDialogComponent } from './components/canteen-menu/canteen-menu-form-page/canteen-menu-food-item-pick-dialog/canteen-menu-food-item-pick-dialog.component';
import { FoodOrderListComponent } from './components/food-order/food-order-list-page/food-order-list/food-order-list.component';
import { TransferRequestListComponent } from './components/transfer-request/transfer-request-list-page/transfer-request-list/transfer-request-list.component';
import { FoodOrderListPageComponent } from './components/food-order/food-order-list-page/food-order-list-page.component';
import { FoodOrderPageComponent } from './components/food-order/food-order-page.component';
import { TransferRequestPageComponent } from './components/transfer-request/transfer-request-page.component';
import { TransferRequestListPageComponent } from './components/transfer-request/transfer-request-list-page/transfer-request-list-page.component';
import { CanteenListPageComponent } from './components/canteen-list-page/canteen-list-page.component';
import { CanteenListComponent } from './components/canteen-list-page/canteen-list/canteen-list.component';
import { CouponFormPageComponent } from './components/coupon-page/coupon-form-page/coupon-form-page.component';
import { CouponFormComponent } from './components/coupon-page/coupon-form-page/coupon-form/coupon-form.component';
import { CouponPageComponent } from './components/coupon-page/coupon-page.component';
import { CouponListPageComponent } from './components/coupon-page/coupon-list-page/coupon-list-page.component';
import { CouponListComponent } from './components/coupon-page/coupon-list-page/coupon-list/coupon-list.component';
import { CouponApproveDialogComponent } from './components/coupon-page/coupon-approve-dialog/coupon-approve-dialog.component';
import { CouponRejectDialogComponent } from './components/coupon-page/coupon-reject-dialog/coupon-reject-dialog.component';
import { CanteenFormPageComponent } from './components/canteen-form-page/canteen-form-page.component';
import { CanteenFormComponent } from './components/canteen-form-page/canteen-form/canteen-form.component';
import { CouponOrderListPageComponent } from './components/coupon-page/coupon-order-list-page/coupon-order-list-page.component';
import { CouponOrderListComponent } from './components/coupon-page/coupon-order-list-page/coupon-order-list/coupon-order-list.component';
import { FoodOrderDetailDialogComponent } from './components/food-order/food-order-list-page/food-order-detail-dialog/food-order-detail-dialog.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

export const COMPONENTS = [
    CanteenPageComponent,
    TransactionPageComponent,
    TransactionListComponent,
    CanteenMenuPageComponent,
    CanteenMenuListPageComponent,
    CanteenMenuListComponent,
    CanteenMenuFormPageComponent,
    CanteenMenuFormComponent,
    CanteenMenuFoodItemPickListComponent,
    CanteenMenuFoodItemPickDialogComponent,
    FoodItemPageComponent,
    FoodItemListPageComponent,
    FoodItemListComponent,
    FoodItemFormPageComponent,
    FoodItemFormComponent,
    FoodItemCustomizationFormComponent,
    FoodItemCustomizationOptionFormComponent,
    FoodOrderPageComponent,
    FoodOrderListPageComponent,
    FoodOrderListComponent,
    FoodOrderDetailDialogComponent,
    TransferRequestPageComponent,
    TransferRequestListPageComponent,
    TransferRequestListComponent,
    CanteenListPageComponent,
    CanteenListComponent,
    CouponPageComponent,
    CouponListPageComponent,
    CouponListComponent,
    CouponFormPageComponent,
    CouponFormComponent,
    CouponApproveDialogComponent,
    CouponRejectDialogComponent,
    CanteenFormPageComponent,
    CanteenFormComponent,
    CouponOrderListPageComponent,
    CouponOrderListComponent
];
@NgModule({
    imports: [
        CommonModule,
        CanteenRoutingModule,
        SharedModule,
        SharedComponentModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    exports: COMPONENTS,
    declarations: COMPONENTS
})
export class CanteenModule {}

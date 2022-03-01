import { ISchool } from '@portal/school/models/school.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { IUser } from '@portal/shared/models/user.model';
import { IFoodItemCustomization } from './food-item.model';
import { IInvoice } from './invoice.model';

export interface IFoodOrder extends IBaseModel {
    coupon?: string;
    isPartialCoveredByCoupon: boolean;
    partialBalanceAmount: number;
    orderStatus: string;
    orderDate: Date;
    items: IFoodOrderItem[];
    returnItems: IFoodOrderItem[];
    student: IFoodOrderStudent;
    orderId: string;
    createdAt: Date;
    school?: ISchool;
    subTotal: number;
    totalAmount: number;
    vatAmount: number;
    invoice: IInvoice;
}

export interface IFoodOrderItem extends IBaseModel {
    foodPrice: number;
    food: IFoodOrderItemFood;
    quantity: number;
    fromOrder: IFoodOrderReturnFrom;

    selectedCustomizations: IFoodOrderSelectedCustomization[];
}

export interface IFoodOrderItemFood extends IBaseModel {
    appliedCouponDiscountAmount: number;
    translations: ITranslation;
}

export interface IFoodOrderSelectedCustomization extends IBaseModel {
    customization: IFoodItemCustomization;
    values: IFoodOrderSelectedCustomizationValue[];
}

export interface IFoodOrderSelectedCustomizationValue extends IBaseModel {
    price: number;
    option: IFoodOrderSelectedCustomizationValueOption;
}

export interface IFoodOrderSelectedCustomizationValueOption extends IBaseModel {
    translations: ITranslation;
}

export interface IFoodOrderStudent extends IBaseModel {
    studentName: string;
    grade: IStudentGrade;
    section: string;
    translations: ITranslation;
    user: IUser;
}

export interface IStudentGrade extends IBaseModel {
    grade: string;
    section: string;
}

export interface IFoodOrderReturnFrom extends IBaseModel {
    orderId: string;
}

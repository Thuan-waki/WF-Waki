import { Time } from '@angular/common';
import { IStudent } from '@portal/school/models/student.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { IBankAccount, ICanteen } from './canteen.model';
import { ICoupon } from './coupon.model';
import { ISchool } from './school.model';

export interface ITransaction extends IBaseModel {
    trSource: string;
    isDeleted: boolean;
    transactionId: string;
    from: ITransactionOrigin;
    to: ITransactionOrigin;
    trType: string;
    amount: number;
    externalPlatform: string;
    externalTransactionRefId: string;
    externalPaymentVerified: boolean;
    externalPaymentObject?: ITransactionExternalPaymentObject;
    trDate: Date;
    trTime: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    balance: number;
    couponId?: ICoupon;
    canteenVatAmount: number;
    purposeOfTransfer: string;
    purposeOfRefund: string;
    canteen?: ICanteen;
    school: ISchool;
    student?: ITransactionStudent;
    toBankAccount?: IBankAccount;
    foodOrderId?: ITransactionFoodOrderId;
}

export interface ITransactionOrigin extends IBaseModel {
    mobileNo: string;
    translations: ITranslation;
}

export interface ITransactionStudent extends IBaseModel {
    translations: ITranslation;
}

export interface ITransactionExternalPaymentObject {
    source: ITransactionExternalPaymentObjectSource;
}

export interface ITransactionExternalPaymentObjectSource {
    company: string;
    number: string;
    type: string;
}

export interface ITransactionFoodOrderId {
    canteen: ICanteen;
    school: ISchool;
    student: IStudent;
}

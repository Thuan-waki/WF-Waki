import { ISchool } from '@portal/school/models/school.model';
import { IStudent } from '@portal/school/models/student.model';
import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { ICanteen } from './canteen.model';
import { ICoupon } from './coupon.model';
import { IInvoice } from './invoice.model';

export interface ICouponOrder extends IBaseModel {
    subTotal: number;
    totalAmount: number;
    coupon: ICoupon;
    orderedByParent: ICouponOrderByParent;
    forUser: string;
    student: IStudent;
    vatAmount: number;
    school: ISchool;
    canteen: ICanteen;
    orderId: string;
    orderDate: Date;
    isCouponExpired?: boolean;
    invoice: IInvoice;
}

export interface ICouponOrderFilter {
    school?: string;
    canteen?: string;
    student?: string;
    page: number;
    limit: number;
    search?: string;
    fromDate: Date;
    toDate: Date;
    coupon?: string;
}

export interface ICouponOrderByParent {
    translations: ITranslation;
}

export const defaultCouponOrderFilter: ICouponOrderFilter = {
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear()),
    page: 1,
    limit: 50
};

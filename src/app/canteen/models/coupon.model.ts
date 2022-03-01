import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { ICanteen } from './canteen.model';

export interface ICoupon extends IBaseModel {
    forSpecificSchools: boolean;
    onlyForSchools: string[];
    redeemForOnlineOrder: boolean;
    redeemForWalkinOrder: boolean;
    noOfRedeemed: number;
    status: CouponStatuses;
    isPublished: boolean;
    couponName: string;
    creditAvail: number;
    saveAmount: number;
    couponPrice: number;
    validityInDays: number;
    canteen: ICanteen;
    wakiFeePercentage: number;
    translations: ITranslation;
}

export interface ICouponFilter {
    page: number;
    limit: number;
    search?: string;
    canteen?: string;
}

export const defaultCouponFilter: ICouponFilter = {
    page: 1,
    limit: 50
};

export enum CouponStatuses {
    'Rejected' = 'REJECTED',
    'Pending' = 'PENDING',
    'Approved' = 'APPROVED'
}

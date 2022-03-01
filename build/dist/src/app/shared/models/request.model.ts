import { IBankAccount } from '@portal/canteen/models/canteen.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';

export interface IRequest extends IBaseModel {
    amount: number;
    createdAt: Date;
    isDeleted: boolean;
    isValid: boolean;
    rejectionReason: string;
    requestId: string;
    requestType: 'CANTEEN_TRANSFER_REQUEST' | 'PARENT_REFUND';
    rqDate: Date;
    rqStatus: string;
    rqTime: Date;
    updatedAt: Date;
    user: string;
    purposeOfRefund: string;
    canteen: ITransferRequestCanteen;
    trAccount?: IRefundRequestAccount;
}

export interface ITransferRequestCanteen extends IBaseModel {
    translations: ITranslation;
    canteenName: string;
    id: string;
    address: string;
    bankAccount: IBankAccount;
}

export interface IRefundRequestAccount extends IBaseModel {
    IBAN: string;
    accountName: string;
    accountNo: string;
    bank: IBankAccount;
}

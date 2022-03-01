import { ICanteen } from '@portal/canteen/models/canteen.model';
import { IInvoice } from '@portal/canteen/models/invoice.model';
import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';
import { IBaseModel } from '@portal/shared/models/base.model';

export interface IFee extends IBaseModel {
    feeId: string;
    trType: string;
    vat: number;
    total: number;
    createdAt: Date;
    invoice: IInvoice;
    canteen: ICanteen;
}

export interface IFeeFilter {
    canteen: string;
    page: number;
    limit: number;
    fromDate?: Date | string;
    toDate?: Date | string;
}

export const defaultFeeFilter = {
    canteen: '',
    page: 1,
    limit: 50,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear())
};

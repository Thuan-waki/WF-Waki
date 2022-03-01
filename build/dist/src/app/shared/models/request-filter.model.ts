import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';

export interface IRequestFilter {
    search?: string;
    page: number;
    limit: number;
    requestType: string;
    canteen?: string;
    fromDate: Date;
    toDate: Date;
}

export const defaultTransferRequestFilter: IRequestFilter = {
    requestType: 'CANTEEN_TRANSFER_REQUEST',
    canteen: '',
    page: 1,
    limit: 50,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear())
};

export const defaultRefundRequestFilter: IRequestFilter = {
    requestType: 'PARENT_REFUND',
    canteen: '',
    page: 1,
    limit: 50,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear())
};

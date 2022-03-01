import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';
import { TransactionTypes } from './transaction-types';

export interface ITransactionFilter {
    school?: string;
    canteen?: string;
    fromDate: Date;
    toDate: Date;
    trType?: string;
    page?: number;
    limit?: number;
    search?: string;
    parent?: string;
    userType?: 'adult' | 'canteen';
}

export const defaultTransactionFilter: ITransactionFilter = {
    school: '',
    canteen: '',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear()),
    trType: '',
    page: 1,
    limit: 50,
    userType: 'canteen'
};

export const defaultCanteenTransactionFilter: ITransactionFilter = {
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear()),
    page: 1,
    limit: 50,
    userType: 'canteen'
};

export const defaultAdultTransactionFilter: ITransactionFilter = {
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear()),
    page: 1,
    limit: 50,
    userType: 'adult'
};

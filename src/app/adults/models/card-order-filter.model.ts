import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';

export interface ICardOrderFilter {
    search?: string;
    page?: number;
    limit?: number;
    fromDate: Date;
    toDate: Date;
    school?: string;
}

export const defaultCardOrderFilter: ICardOrderFilter = {
    search: '',
    page: 1,
    limit: 50,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear())
};

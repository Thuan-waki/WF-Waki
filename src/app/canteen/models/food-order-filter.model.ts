export interface IFoodOrderFilter {
    page: number;
    limit: number;
    search?: string;
    school?: string;
    canteen?: string;
    orderType?: string;
    orderStatus?: string;
    orderFromDate?: Date | string;
    orderToDate?: Date | string;
    fromDate?: Date | string;
    toDate?: Date | string;
    gender?: string;
}

export const defaultFoodorderFilter: IFoodOrderFilter = {
    search: '',
    page: 1,
    limit: 50,
    orderFromDate: '',
    orderToDate: ''
};

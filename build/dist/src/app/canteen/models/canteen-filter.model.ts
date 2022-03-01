export interface ICanteenFilter {
    search?: string;
    page?: number;
    limit?: number;
}

export const defaultCanteenFilter: ICanteenFilter = {
    search: '',
    page: 1,
    limit: 50
};

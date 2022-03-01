export interface IFoodItemFilter {
    search?: string;
    page?: number;
    limit?: number;
    canteen?: string;
}

export const defaultFoodItemFilter: IFoodItemFilter = {
    search: '',
    page: 1,
    limit: 50
};

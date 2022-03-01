export interface ISchoolFilter {
    search?: string;
    page?: number;
    limit?: number;
}

export const defaultSchoolFilter: ISchoolFilter = {
    search: '',
    page: 1,
    limit: 50
};

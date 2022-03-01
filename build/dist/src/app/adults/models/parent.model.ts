import { ISchool } from '@portal/school/models/school.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { IUser } from '@portal/shared/models/user.model';

export interface IParent extends IBaseModel {
    availableAmount: number;
    maxAmount: number;
    noOfChildren: number;
    sex: string;
    nationalId: string;
    cardStatus: 'ACTIVE' | 'INACTIVE' | undefined;
    children?: IChildren[];
    user: IUser;
}

export interface IChildren extends IBaseModel {
    school: ISchool;
    user: IUser;
}

export interface IParentFilter {
    search?: string;
    page?: number;
    limit?: number;
}

export const defaultParentFilter: IParentFilter = {
    search: '',
    page: 1,
    limit: 50
};

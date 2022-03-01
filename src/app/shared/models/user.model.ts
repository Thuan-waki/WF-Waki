import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ISchool } from '@portal/school/models/school.model';
import { UserRoles } from '../constants/user-roles.constants';
import { IBaseModel } from './base.model';
import { ITranslation } from './translation.model';

export interface Credentials {
    email: string;
    password: string;
}

export interface IUser extends IBaseModel {
    fullName: string;
    email: string;
    mobileNo: string;
    isProfileSetup: boolean;
    roles: string[];
    permissions: string[];
    schools: ISchool[];
    canteens: ICanteen[];
    orderStatus?: any;
    token?: string;
    refreshToken?: string;
    createdAt?: Date;
    currentBalance?: number;
    nationalId?: number;
    cardId?: string;
    cardSerialNo?: string;
    profilePic?: string;
    sex?: string;
    emailVerificationStatus?: string;
    mobileNoVerificationStatus?: string;
    isCardEnabled?: boolean;
    translations?: ITranslation;
    isValid?: boolean;
}

export const defaultUser: IUser = {
    _id: '',
    fullName: '',
    email: '',
    mobileNo: '',
    isProfileSetup: false,
    permissions: [],
    schools: [],
    canteens: [],
    roles: []
};

export interface IUSerSchool extends IBaseModel {
    id: string;
    schoolRegistrationCode: string;
    schoolName: string;
    translations: ITranslation;
}

export interface IUserCanteen extends IBaseModel {
    id: string;
    canteenId: string;
    canteenName: string;
    translations: ITranslation;
}

export interface IUserFilter {
    search?: string;
    page?: number;
    limit?: number;
    schoolId?: string;
    roles?: string;
}

export const defaultUserFilter: IUserFilter = {
    search: '',
    page: 1,
    limit: 50
};

export const defaultBusinessUserFilter: IUserFilter = {
    search: '',
    page: 1,
    limit: 50,
    roles: [
        UserRoles.SUPER_CANTEEN_USER,
        UserRoles.CANTEEN_USER,
        UserRoles.CANTEEN_APP_USER,
        UserRoles.SUPER_SCHOOL_USER,
        UserRoles.SCHOOL_USER,
        UserRoles.ATTENDANCE_APP_USER
    ].join(',')
};

import { ISchool } from '@portal/school/models/school.model';
import { IBank } from '@portal/shared/models/bank.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { IUser } from '@portal/shared/models/user.model';
import { IStreetAddress } from './street-address.model';

export interface ICanteen extends IBaseModel {
    address: string;
    canteenId: string;
    canteenName: string;
    createdAt: Date;
    createBy: string;
    numOfStudents: number;
    currentSubscriptionEnds: Date;
    currentSubscriptionStarts: Date;
    email: string;
    hasUpdatedStudentData: boolean;
    id: string;
    isDeleted: boolean;
    isValid: boolean;
    mobileNo: string;
    phone: string;
    subscriptionsHistory: any[];
    transactionFee: number;
    updatedAt: Date;
    users: IUser[];
    vat: string;
    vatPercentage: number;
    translations: ITranslation;
    schools: ISchool[];
    bankAccount?: IBankAccount;
    streetAddress: IStreetAddress;
    officialNameTranslations: ITranslation;
}

export interface IBankAccount {
    accountNo: string;
    accountName: string;
    IBAN: string;
    bank: IBank;
    translations?: ITranslation;
}

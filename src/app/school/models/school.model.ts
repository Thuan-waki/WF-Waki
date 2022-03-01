import { IStreetAddress } from '@portal/canteen/models/street-address.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ICity } from '@portal/shared/models/city.model';
import { ICountry } from '@portal/shared/models/country.model';
import { ITranslation } from '@portal/shared/models/translation.model';

export interface ISchool extends IBaseModel {
    address: string;
    canteens: ISchoolCanteen[];
    city?: ICity;
    country?: ICountry;
    createdAt: Date;
    createdBy: string;
    creditLimit: number;
    currency: string;
    currentAttendanceSubscriptionEnds: Date;
    currentAttendanceSubscriptionStarts: Date;
    currentSubscriptionEnds: Date;
    currentSubscriptionStarts: Date;
    email: string;
    hasAttendanceAccess: boolean;
    hasCanteenAccess: boolean;
    hasUpdatedStudentData: boolean;
    id: string;
    initDailyPurchase: number;
    isDeleted: boolean;
    isValid: boolean;
    mobileNo: string;
    noOfStudents?: number;
    phone: string;
    physicalDevices: string[];
    schoolName: string;
    schoolRegistrationCode: string;
    updatedAt: Date;
    vat: string;
    subscriptionHistory: ISchoolSubscription[];
    translations: ITranslation;
    streetAddress?: IStreetAddress;
    officialNameTranslations?: ITranslation;
    schoolType?: ISchoolType;
    schoolLevel?: ISchoolLevel;
}

export interface ISchoolSubscription extends IBaseModel {
    subscriptionType: string;
    isDeleted: boolean;
}

export interface ISchoolCanteen extends IBaseModel {
    canteenId: string;
    canteenName: string;
    id: string;
    translations: ITranslation;
}

export interface ISchoolType {
    public: boolean;
    national: boolean;
    international: boolean;
    quranic: boolean;
    technical: boolean;
}

export interface ISchoolLevel {
    nursery: boolean;
    kindergarten: boolean;
    elementary: boolean;
    intermediate: boolean;
    secondary: boolean;
}

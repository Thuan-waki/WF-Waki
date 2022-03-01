import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { IUser } from '@portal/shared/models/user.model';
import { IParent } from './parent.model';
import { ISchool } from './school.model';

export interface IStudent extends IBaseModel {
    studentId: string;
    canteenCreditLimit: number;
    cardStatus: 'ACTIVE' | 'INACTIVE' | undefined;
    cardSerialNo?: string;
    createdAt: Date;
    creditHistory: [];
    currentBalance: number;
    dailyLimit: number;
    dob: Date;
    isDeleted: boolean;
    isValid: boolean;
    nationalId: string;
    payByCard: boolean;
    payByFingerPrint: boolean;
    payByStudentId: boolean;
    payOnlyAtSchool: boolean;
    school: ISchool;
    section: string;
    sex: string;
    studentName: string;
    updatedAt: Date;
    user: IUser;
    translations: ITranslation;
    grade: IStudentGrade;
    parents: IParent[];
    adult: IStudentAdult;
}

export interface IStudentGrade extends IBaseModel {
    grade: string;
}

export interface IStudentAdult extends IBaseModel {
    translations: ITranslation;
}

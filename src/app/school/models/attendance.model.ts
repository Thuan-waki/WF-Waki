import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ISchool } from './school.model';
import { IStudent } from './student.model';

export interface IAttendance extends IBaseModel {
    isEarly: boolean;
    isLate: boolean;
    isAbsent: boolean;
    isDeleted: boolean;
    deviceSN: string;
    cardOrFpId: string;
    atDate: Date;
    atCheckIn: Date;
    atCheckOut: Date;
    student: IStudent;
    school: ISchool;
}

export interface IAttendanceFilter {
    search?: string;
    fromDate: Date;
    toDate: Date;
    page?: number;
    limit?: number;
    school?: string;
}

export const defaultAttendanceFilter: IAttendanceFilter = {
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear()),
    page: 1,
    limit: 50
};

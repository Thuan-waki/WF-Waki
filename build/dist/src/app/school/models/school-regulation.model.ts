import { LastDateOfMonth } from '@portal/shared/functions/last-date-of-month';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';

export interface ISchoolRegulation extends IBaseModel {
    checkIn: string;
    ciAllowedTime: string;
    checkOut: string;
    coAllowedTime: string;
    absentTime: string;
    minCheckInTime: string;
    maxCheckOutTime: string;
    fromDate: Date;
    toDate: Date;
    weekDays?: ISchoolRegulationWeekDays;
}

export interface ISchoolRegulationWeekDays {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export const defaultSchoolRegulation: ISchoolRegulation = {
    _id: '',
    checkIn: '08:00',
    ciAllowedTime: '00:05:00',
    checkOut: '13:00',
    coAllowedTime: '00:05:00',
    absentTime: '08:06',
    minCheckInTime: '00:05:00',
    maxCheckOutTime: '00:05:00',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    toDate: LastDateOfMonth(new Date().getMonth(), new Date().getFullYear())
};

export const regulationOptions: ISelectOption[] = [
    {
        label: '5 Mins',
        value: '00:05:00'
    },
    {
        label: '10 Mins',
        value: '00:10:00'
    },
    {
        label: '15 Mins',
        value: '00:15:00'
    },
    {
        label: '20 Mins',
        value: '00:20:00'
    },
    {
        label: '30 Mins',
        value: '00:30:00'
    },
    {
        label: '45 Mins',
        value: '00:45:00'
    },
    {
        label: '60 Mins',
        value: '00:60:00'
    }
];

import { IBaseModel } from '@portal/shared/models/base.model';
import { ISchoolRegulation } from './school-regulation.model';
import { ISchool } from './school.model';

export interface IGrade extends IBaseModel {
    isValid: boolean;
    grade: string;
    regulations: ISchoolRegulation[];
    school: ISchool | string;
}

export interface IGradeFilter {
    search?: string;
    page?: number;
    limit?: number;
    school?: string;
}

export const defaultGradeFilter: IGradeFilter = {
    search: '',
    page: 1,
    limit: 50
};

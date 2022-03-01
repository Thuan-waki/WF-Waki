import { ISchool } from '@portal/canteen/models/school.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';

export interface IStudentFilter {
    search?: string;
    page?: number;
    limit?: number;
    schoolId?: string;
    gradeId?: string;
    school?: string;
}

export const defaultStudentFilter: IStudentFilter = {
    search: '',
    page: 1,
    limit: 50
};

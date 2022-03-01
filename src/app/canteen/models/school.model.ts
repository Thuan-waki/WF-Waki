import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';

export interface ISchool extends IBaseModel {
    id: string;
    translations: ITranslation;
}

import { IBaseModel } from './base.model';
import { ITranslation } from './translation.model';

export interface IBank extends IBaseModel {
    translations: ITranslation;
}

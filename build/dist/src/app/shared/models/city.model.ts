import { IBaseModel } from './base.model';
import { ITranslation } from './translation.model';

export interface ICity extends IBaseModel {
    translations: ITranslation;
}

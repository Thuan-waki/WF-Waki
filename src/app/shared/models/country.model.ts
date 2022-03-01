import { IBaseModel } from './base.model';
import { ICity } from './city.model';
import { ITranslation } from './translation.model';

export interface ICountry extends IBaseModel {
    translations: ITranslation;
}

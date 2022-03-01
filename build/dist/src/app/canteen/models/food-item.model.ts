import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { ICanteen } from './canteen.model';

export interface IFoodItem extends IBaseModel {
    calories: number;
    availableQuantity: number;
    maxQuantityForOrder: number;
    pricePerItem: number;
    translations: ITranslation;
    image?: string;
    description?: ITranslation;
    customizations: IFoodItemCustomization[];
    canteen?: ICanteen;
}

export interface IFoodItemCustomization {
    name?: string;
    translations: ITranslation;
    customizationType: 'MULTI_CHOICE' | 'SINGLE_CHOICE';
    options: IFoodItemCustomizationOption[];
}

export interface IFoodItemCustomizationOption {
    name?: string;
    translations: ITranslation;
    hasExtraPrice: boolean;
    extraPrice: number;
}

export const foodItem = {
    _id: '',
    availableQuantity: 0,
    maxQuantityForOrder: 0,
    pricePerItem: 0,
    translations: {
        en: '',
        ar: ''
    },
    customizations: []
};

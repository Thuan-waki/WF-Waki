import { ISchool } from '@portal/school/models/school.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';
import { IFoodItem } from './food-item.model';

export interface ICanteenMenu extends IBaseModel {
    foodItems: IFoodItem[];
    enabledForParentApp: boolean;
    enabledForDeviceApp: boolean;
    isPublishedForAdultApp: boolean;
    isPublishedForBusinessApp: boolean;
    isValid: true;
    isDeleted: false;
    name: string;
    canteen: string;
    createdAt: Date;
    updatedAt: Date;
    schools: string[] | ISchool[];
    translations: ITranslation;
}

export interface ICanteenMenuFilter {
    page: number;
    limit: number;
    search?: string;
    school?: string;
    canteen?: string;
}

export const defaultCanteenMenuFilter: ICanteenMenuFilter = {
    search: '',
    page: 1,
    limit: 50
};

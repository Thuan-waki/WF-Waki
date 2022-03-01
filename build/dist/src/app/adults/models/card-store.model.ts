import { IBaseModel } from "@portal/shared/models/base.model";
import { ITranslation } from "@portal/shared/models/translation.model";

export interface IStoreItem extends IBaseModel {
    type: string;
    color: string;
    availableQuantity?: number;
    pricePerItem?: number;
    vat?: number;
    maxQuantityForOrder?: number;
    image?: string;
    order?: number;
    isPublished?: boolean;
    translations?: ITranslation;
    description?: string;
    createdBy?: string;
    theme?: string;
    totalNoOfPurchases?: number;
}

export interface ICardStoreFilter {
    search?: string;
    page?: number;
    limit?: number;
    type?: string;
    color?: string;
    isPublished?: boolean;
}

export const defaultCardStoreFilter: ICardStoreFilter = {
    search: '',
    page: 1,
    limit: 10
};
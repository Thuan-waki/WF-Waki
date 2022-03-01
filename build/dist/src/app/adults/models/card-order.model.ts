import { IInvoice } from '@portal/canteen/models/invoice.model';
import { ISchool } from '@portal/school/models/school.model';
import { IBaseModel } from '@portal/shared/models/base.model';
import { ITranslation } from '@portal/shared/models/translation.model';

export interface ICardOrder extends IBaseModel {
    cardColor: string;
    orderDate: Date;
    orderId: string;
    orderStatus: 'DELIVERED' | 'PENDING';
    vatAmount: number;
    totalAmount: number;
    forUser: ICardOrderUser;
    orderedByParent: ICardOrderUser;
    school: ISchool;
    invoice: IInvoice;
}

export interface ICardOrderUser extends IBaseModel {
    translations: ITranslation;
    nationalId: string;
}

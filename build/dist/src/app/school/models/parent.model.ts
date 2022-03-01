import { IBaseModel } from '@portal/shared/models/base.model';
import { IUser } from '@portal/shared/models/user.model';

export interface IParent extends IBaseModel {
    user: IUser;
}

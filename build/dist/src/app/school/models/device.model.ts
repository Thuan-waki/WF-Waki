import { IBaseModel } from '@portal/shared/models/base.model';

export interface IDevice extends IBaseModel {
    deviceType: string;
    deviceSerialNo: string;
    school: string;
    location: string;
}

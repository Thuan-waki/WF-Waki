import { IApiResult } from '@portal/shared/models/api-result.model';

export interface ILoginResult extends IApiResult {
    otpSent: boolean;
}

export interface IOtpLoginResult extends IApiResult {
    token: string;
    isProfileSetup: false;
    permissions: string[];
    refreshToken: string;
    roles: string[];
    success: boolean;
}

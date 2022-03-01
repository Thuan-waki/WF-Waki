export interface IApiStatus {
    message: string;
    isCommunicating: boolean;
    isSuccessful: boolean;
}

export const defaultApiStatus: IApiStatus = {
    message: '',
    isCommunicating: false,
    isSuccessful: false
};

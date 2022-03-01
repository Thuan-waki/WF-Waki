import { GetDisplayDate } from './get-display-date';

export const convertToDate = (time: string): Date => {
    return new Date(`${GetDisplayDate(new Date())}T${time}`);
};

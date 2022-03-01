export const LastDateOfMonth = (month: number, year: number): Date => {
    return new Date(new Date(year, month + 1, 1).setDate(1));
};

export const GetDisplayDate = (value: Date | undefined): string => {
    try {
        return value ? new Date(value).toISOString().split('T')[0] : '';
    } catch (err) {
        return '';
    }
};

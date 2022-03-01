export const GetDisplayTime = (value: Date | undefined): string => {
    try {
        return value ? new Date(value).toISOString().split('T')[1] : '';
    } catch (err) {
        return '';
    }
};

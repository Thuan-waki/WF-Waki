import { FormGroup } from '@angular/forms';
import { convertToDate } from '../functions/convert-to-date';

export const timeRangeValidator = (startTime: string, endTime: string) => {
    return (formGroup: FormGroup) => {
        const start = formGroup.controls[startTime];
        const end = formGroup.controls[endTime];

        if (end.errors && !end.errors.invalidTimeRange) {
            return;
        }

        if (convertToDate(start.value) >= convertToDate(end.value)) {
            end.setErrors({ invalidTimeRange: true });
        } else {
            end.setErrors(null);
        }
    };
};

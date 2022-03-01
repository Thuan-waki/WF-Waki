import { FormGroup } from '@angular/forms';
import { convertToDate } from '../functions/convert-to-date';

export const absentTimeValidator = (
    checkInTime: string,
    checkoutTime: string,
    checkInAllowance: string,
    checkOutAllowance: string,
    absentTime: string
) => {
    return (formGroup: FormGroup) => {
        const checkIn = formGroup.controls[checkInTime];
        const checkOut = formGroup.controls[checkoutTime];
        const inAllowance = formGroup.controls[checkInAllowance];
        const outAllowance = formGroup.controls[checkOutAllowance];
        const absent = formGroup.controls[absentTime];

        if (absent.errors && !absent.errors.invalidAbsentTime) {
            return;
        }

        const checkInWithAllowance = generateDateTimeWithAllowance(checkIn.value, inAllowance.value);
        const checkOutWithAllowance = generateDateTimeWithAllowance(checkOut.value, outAllowance.value, true);
        const convertedAbsent = convertToDate(absent.value);

        if (convertedAbsent <= checkInWithAllowance || convertedAbsent >= checkOutWithAllowance) {
            absent.setErrors({ invalidAbsentTime: true });
        } else {
            absent.setErrors(null);
        }
    };
};

const generateDateTimeWithAllowance = (time: string, allowance: string, isSubstract = false): Date => {
    let convertedTime = convertToDate(time);
    const allowanceLength = isSubstract ? +allowance.substr(3, 2) * -1 : +allowance.substr(3, 2);

    convertedTime.setMinutes(convertedTime.getMinutes() + allowanceLength);
    return convertedTime;
};

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'wakiDate', pure: false })
export class WakiDatePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(date: string | Date, withTime?: boolean): string {
        if (!date) {
            return '';
        }

        const convertedDate = new Date(date);

        if (!withTime) {
            return this.datePipe.transform(convertedDate, 'dd-MM-yyyy') || '';
        }

        return this.datePipe.transform(convertedDate, 'dd-MM-yyyy HH:mm:ss') || '';
    }
}

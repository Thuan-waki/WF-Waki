import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'wakiTime', pure: false })
export class WakiTimePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(date: string | Date): string {
        if (!date) {
            return '';
        }

        const convertedDate = new Date(date);

        return this.datePipe.transform(convertedDate, 'HH:mm:ss') || '';
    }
}

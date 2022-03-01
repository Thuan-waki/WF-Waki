import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'genderPipe', pure: false })
export class GenderPipe implements PipeTransform {
    transform(value: string | null): string | null {
        if (!value || (value !== 'FEMALE' && value !== 'MALE')) {
            return '';
        }

        return value === 'MALE' ? 'Male' : 'Female';
    }
}

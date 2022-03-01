import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'languageTxt', pure: false })
export class LanguageTxtPipe implements PipeTransform {
    transform(value: string | null | undefined): string  {
        if (value === 'ar') {
            return 'English';
        }
        return 'Arabic';
    }
}
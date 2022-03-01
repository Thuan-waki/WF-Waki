import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shorten', pure: false })
export class ShortenPipe implements PipeTransform {
    transform(word: string, length: number, suffix: string = '...') {
        if (!word) {
            return '';
        }

        const trimmedWord = word.trim();

        if (!trimmedWord) {
            return '';
        }

        if (trimmedWord.length <= length) {
            return trimmedWord;
        }

        const shortenedWord = `${word.slice(0, length)}${suffix}`;
        return shortenedWord;
    }
}

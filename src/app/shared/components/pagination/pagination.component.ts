import { EventEmitter } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { getPaginationTxt } from '@portal/shared/functions/get-pagination-text';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
    @Input() currentPage = 1;
    @Input() maxPage = 1;
    @Input() infoText = '';
    @Input() pageOptionsShown = 3;
    @Output() goToPage = new EventEmitter<number>();

    get paginationTxt() {
        return getPaginationTxt(this.infoText);
    }

    constructor() {}

    get pagesForPagination() {
        if (this.maxPage === 1) {
            return [1];
        }

        if (this.maxPage === 2) {
            return [1, 2];
        }

        if (this.currentPage === 1) {
            return [1, 2, 3];
        }

        if (this.currentPage + 1 <= this.maxPage) {
            return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        }

        return [this.maxPage - 2, this.maxPage - 1, this.maxPage];
    }
}

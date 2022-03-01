import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultFoodItemFilter, IFoodItemFilter } from '@portal/canteen/models/food-item-filter.model';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { defaultApiStatus, IApiStatus } from '@portal/shared/models/api-status.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-food-item-list',
    templateUrl: './food-item-list.component.html',
    styleUrls: ['./food-item-list.component.scss']
})
export class FoodItemListComponent extends ComponentBase implements OnChanges {
    @Input() foodItems: IFoodItem[] = [];
    @Input() selectedCanteenId: string = '';
    @Input() schoolOptions: any[] = [];
    @Input() canteenOptions: any[] = [];
    @Input() isLoading: boolean = true;
    @Input() isAdmin: boolean = false;
    @Input() recordCount = 0;
    @Input() maxPage = 0;
    @Input() pageSize = defaultFoodItemFilter.limit || 50;
    @Input() apiStatus: IApiStatus = defaultApiStatus;
    @Output() edit = new EventEmitter<IFoodItem>();
    @Output() add = new EventEmitter<string>();
    @Output() filter = new EventEmitter<IFoodItemFilter>();

    currentPage = 1;
    imageServerUrl = getImageServerUrl();

    form: FormGroup = this.fb.group({
        search: [''],
        school: [null],
        canteen: [null]
    });

    constructor(
        private fb: FormBuilder,
        private excelExportService: ExcelExportService,
        private utilitiesServices: UtilitiesService
    ) {
        super();
        this.form
            .get('search')!
            .valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
            .subscribe(() => this.filterRecord());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedCanteenId) {
            this.form.get('canteen')?.setValue(this.selectedCanteenId);
            this.form.get('canteen')?.updateValueAndValidity();
        }
    }

    getFilter = () => {
        let filterValues: IFoodItemFilter = {
            search: this.form.get('search')?.value || '',
            page: this.currentPage,
            limit: this.pageSize,
            canteen: this.form.get('canteen')?.value || ''
        };

        return filterValues;
    };

    filterRecord = () => {
        this.currentPage = 1;
        const filterValues = this.getFilter();
        this.filter.emit(filterValues);
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.filterRecord();
    };

    exportToExcel = () => {
        const rows = this.foodItems.map((row) => {
            const r: any = {};

            r['ID'] = row._id;
            r['Available Quantity'] = row.availableQuantity;
            r['Max Quantity for Order'] = row.maxQuantityForOrder;
            r['Price per Item'] = row.pricePerItem;
            r['Name in English'] = row.translations?.en || '';
            r['Name in Arabic'] = row.translations?.ar || '';

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesServices.generateExcelFileName(`Food_Item`));
    };

    addFoodItem = () => {
        if (this.isAdmin) {
            this.add.emit(this.form.get('canteen')?.value);
        } else {
            this.add.emit();
        }
    };

    get infoText() {
        return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
    }
}

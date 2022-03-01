import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultFoodItemFilter, IFoodItemFilter } from '@portal/canteen/models/food-item-filter.model';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { FoodItemService } from '@portal/canteen/services/food-item.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-menu-food-item-pick-dialog',
    templateUrl: './canteen-menu-food-item-pick-dialog.component.html',
    styleUrls: ['./canteen-menu-food-item-pick-dialog.component.scss']
})
export class CanteenMenuFoodItemPickDialogComponent extends ComponentBase implements OnInit {
    form: FormGroup = this.fb.group({
        search: ['']
    });
    foodItems: IFoodItem[] = [];
    selectedFoodItems: IFoodItem[] = [];
    imageServerUrl = getImageServerUrl();
    canteenId = '';
    foodItemRecordCount = 0;

    currentPage = 1;
    pageSize = defaultFoodItemFilter.limit || 50;
    maxPage = 0;

    isLoading = true;

    constructor(
        private activeModal: NgbActiveModal,
        private foodItemService: FoodItemService,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit(): void {
        this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => this.getFoodItems());
        this.getFoodItems();
    }

    close = () => {
        this.activeModal.close(this.selectedFoodItems);
    };

    onFoodItemCheckBoxClick = (event: any, foodItem: IFoodItem) => {
        if (event.target.checked) {
            this.selectedFoodItems = [...this.selectedFoodItems, foodItem];
        } else {
            this.selectedFoodItems = this.selectedFoodItems.filter((item) => item._id !== foodItem._id);
        }
    };

    isSelected = (foodItem: IFoodItem) => {
        return this.selectedFoodItems?.filter((item) => item._id === foodItem._id)?.length || false;
    };

    getFoodItems = () => {
        this.isLoading = true;
        this.foodItems = [];
        const filter: IFoodItemFilter = {
            search: this.form.get('search')?.value || '',
            page: this.currentPage,
            limit: this.pageSize
        };

        this.foodItemService
            .getFoodItems(this.canteenId, filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.foodItems = result.body.foodItems || [];
                        this.foodItemRecordCount = Number(result.headers?.get(X_TOTAL_COUNT)) || 0;
                        const numberOfPages = this.foodItemRecordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Food Items Missing', 'Food Items');
                        this.close();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    goToPage = (pageNumber: number) => {
        this.currentPage = pageNumber;
        this.getFoodItems();
    };
}

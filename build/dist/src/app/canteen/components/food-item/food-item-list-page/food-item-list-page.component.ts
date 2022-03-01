import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '@portal/shared/components/component-base';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { defaultApiStatus } from '@portal/shared/models/api-status.model';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultFoodItemFilter, IFoodItemFilter } from '@portal/canteen/models/food-item-filter.model';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { of } from 'rxjs';
import { FoodItemService } from '@portal/canteen/services/food-item.service';
import { HttpResponse } from '@angular/common/http';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from '@portal/school/services/school.service';
import { Router } from '@angular/router';
import { selectOptions } from '@portal/shared/functions/get-select-options';

@Component({
    selector: 'app-food-item-list-page',
    templateUrl: './food-item-list-page.component.html',
    styleUrls: ['./food-item-list-page.component.scss']
})
export class FoodItemListPageComponent extends ComponentBase implements OnInit {
    canteenId = '';
    foodItems: IFoodItem[] = [];
    canteenOptions: any[] = [];
    schoolOptions: any[] = [];
    isLoading = true;
    isAdmin = false;
    defaultApiStatus = defaultApiStatus;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultFoodItemFilter.limit || 50;
    hasCanteen = false;

    constructor(
        private foodItemService: FoodItemService,
        private canteenService: CanteenService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) {
        super();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        this.canteenId = this.authService.getUserCanteenId();

        if (this.isAdmin) {
            this.getSchools();
            this.getCanteens();
        } else {
            this.getFoodItems({ ...defaultFoodItemFilter, canteen: this.canteenId });
        }
    }

    getSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.schools && result.schools.length) {
                        this.schoolOptions = selectOptions(result.schools || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getFoodItems = (filter: IFoodItemFilter) => {
        this.isLoading = true;
        this.canteenId = filter.canteen || '';

        this.foodItemService
            .getFoodItems(filter.canteen || '', filter)
            .pipe(
                tap((res: HttpResponse<IApiResult>) => {
                    if (res.body?.success) {
                        this.foodItems = [...(res.body?.foodItems || [])];
                        this.recordCount = Number(res.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    } else {
                        this.toastr.error('Failed to load canteen menus', 'Canteen Menus');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve Food Items', 'Food Items');
                    this.isLoading = false;

                    return of();
                })
            )
            .subscribe();
    };

    getCanteens = () => {
        this.canteenService
            .getSelectCanteens(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.canteenOptions = selectOptions(result.canteens || []);
                        this.canteenId = this.canteenOptions[0]?.value;

                        this.getFoodItems({ ...defaultFoodItemFilter, canteen: this.canteenId });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    edit = (foodItem: IFoodItem) => {
        this.router.navigateByUrl(`/canteens/food-items/form/${foodItem._id}?canteenId=${this.canteenId}`);
    };

    add = (canteenId: string) => {
        if (this.isAdmin) {
            this.router.navigateByUrl(`/canteens/food-items/form?canteenId=${canteenId}`);
        } else {
            this.router.navigateByUrl(`/canteens/food-items/form`);
        }
    };
}

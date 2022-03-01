import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ICanteenMenu } from '@portal/canteen/models/canteen-menu.model';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { CanteenMenuService } from '@portal/canteen/services/canteen-menu.service';
import { FoodItemService } from '@portal/canteen/services/food-item.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-canteen-menu-form-page',
    templateUrl: './canteen-menu-form-page.component.html',
    styleUrls: ['./canteen-menu-form-page.component.scss']
})
export class CanteenMenuFormPageComponent extends ComponentBase {
    canteenMenu: ICanteenMenu | undefined;
    foodItems: IFoodItem[] | undefined;
    editMode = true;
    canteenId = '';
    canteenMenuId = '';
    foodItemRecordCount = 0;
    isLoading = true;
    schoolOptions: ISelectOption[] = [];
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private canteenMenuService: CanteenMenuService,
        private foodItemService: FoodItemService,
        private schoolService: SchoolService,
        private toastr: ToastrService
    ) {
        super();

        this.canteenId = this.route.snapshot.queryParams.canteen || this.authService.getUserCanteenId();
        this.canteenMenuId = this.route.snapshot.queryParams.id || '';

        if (this.canteenMenuId) {
            this.editMode = true;
            this.getRequiredData();
        } else {
            this.editMode = false;
            this.getFoodItems().subscribe(() => (this.isLoading = false));
        }

        this.getSelectSchools();
    }

    getCanteenMenu = () => {
        return this.canteenMenuService.getCanteenMenu(this.canteenId, this.canteenMenuId).pipe(
            tap((result: IApiResult) => {
                if (result.success) {
                    this.canteenMenu = result.canteenMenu;
                }

                if (!this.canteenMenu || !result.success) {
                    this.toastr.error('Failed to load Canteen Menu', 'Canteen Menu');
                    this.goToCanteenMenu();
                }
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.toastr.error('Failed to load Canteen Menu', 'Canteen Menu');
                this.isLoading = false;
                return of();
            })
        );
    };

    getFoodItems = () => {
        return this.foodItemService.getFoodItems(this.canteenId).pipe(
            tap((result: HttpResponse<IApiResult>) => {
                if (result.body?.success) {
                    this.foodItems = result.body.foodItems;
                    this.foodItemRecordCount = Number(result.headers?.get(X_TOTAL_COUNT)) || 0;
                }

                if (!this.foodItems?.length || !result.body?.success) {
                    this.toastr.error('Food Items Missing', 'Food Items');
                    this.goToCanteenMenu();
                }
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                return of();
            })
        );
    };

    getRequiredData = () => {
        forkJoin([this.getCanteenMenu(), this.getFoodItems()])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((e) => {
                this.isLoading = false;
            });
    };

    getSelectSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'], this.canteenId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.schoolOptions = (result.schools || []).map((school) => {
                            return {
                                label: translationLang(school?.translations),
                                value: school?._id
                            };
                        });
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    save = (canteenMenu: ICanteenMenu) => {
        this.isLoading = true;
        this.errorMessage = '';
        const obs = this.editMode ? this.patch(canteenMenu) : this.create(canteenMenu);

        obs.pipe(
            tap((result: IApiResult) => {
                this.toastr.success('Food Menu Save Successful', 'Save Canteen Menu');
                this.isLoading = false;
                this.goToCanteenMenu();
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.toastr.error('Failed to Save Menu', 'Save Canteen Menu');

                if (error.error?.conflictingSchools?.length) {
                    const school = translationLang(error.error.conflictingSchools[0]?.translations);

                    this.errorMessage = `Menu is already published for ${school}`;
                }
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    patch = (canteenMenu: ICanteenMenu) => {
        return this.canteenMenuService.patchCanteenMenu(this.canteenId, this.canteenMenuId, canteenMenu);
    };

    create = (canteenMenu: ICanteenMenu) => {
        return this.canteenMenuService.postCanteenMenu(this.canteenId, canteenMenu);
    };

    goToCanteenMenu = () => {
        this.router.navigate(['/canteens/canteen-menu']);
    };
}

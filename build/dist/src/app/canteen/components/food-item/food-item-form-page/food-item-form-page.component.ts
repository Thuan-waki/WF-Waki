import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { FoodItemService } from '@portal/canteen/services/food-item.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { IUser } from '@portal/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-food-item-form-page',
    templateUrl: './food-item-form-page.component.html',
    styleUrls: ['./food-item-form-page.component.scss']
})
export class FoodItemFormPageComponent extends ComponentBase {
    foodItem: IFoodItem | undefined;
    user: IUser | undefined;
    isLoading: boolean = true;
    canteenId = '';
    isEditing = false;
    foodItemId = '';
    currentImage = '';

    constructor(
        private foodItemService: FoodItemService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
    ) {
        super();

        const id = this.route.snapshot.params.id || '';
        this.canteenId = this.authService.isAdminOrSuperAdmin()
            ? this.route.snapshot.queryParams.canteenId
            : this.authService.user?.canteens[0]?._id;

        if (id) {
            this.foodItemId = id;
            this.getFoodItem(this.canteenId, this.foodItemId);
            this.isEditing = true;
        } else {
            this.isLoading = false;
        }
    }

    getFoodItem = (canteenId: string, foodItemId: string) => {
        this.foodItemService
            .getFoodItem(canteenId, foodItemId)
            .pipe(
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLoading = false;
                    return of<IApiResult>();
                })
            )
            .subscribe((res: IApiResult) => {
                if (res.foodItem) {
                    this.foodItem = res.foodItem;
                }

                this.isLoading = false;
            });
    };

    setCurrentImage = (image: any) => {
        this.currentImage = image;
    };

    save = (foodItem: IFoodItem) => {
        this.isLoading = true;

        if (this.isEditing) {
            this.foodItemService
                .patchFoodItem(this.canteenId || '', this.foodItemId, foodItem, this.currentImage)
                .pipe(
                    takeUntil(this.destroyed$),
                    catchError(() => {
                        this.isLoading = false;
                        this.toastr.error('Food item save failed', 'Save Food Item');

                        return of<HttpEvent<IApiResult>>();
                    })
                )
                .subscribe((res: any) => {
                    if (res.type === HttpEventType.Response) {
                        this.toastr.success('Food item save success', 'Save Food Item');
                        this.exit();
                    }
                });

            return;
        }

        this.foodItemService
            .postFoodItem(this.canteenId, foodItem)
            .pipe(
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLoading = false;
                    this.toastr.error('Food item save failed', 'Save Food Item');

                    return of<HttpEvent<IApiResult>>();
                })
            )
            .subscribe((res: HttpEvent<IApiResult>) => {
                if (res.type === HttpEventType.Response) {
                    this.toastr.success('Food item save success', 'Save Food Item');
                    this.exit();
                }
            });
    };

    exit = () => {
        this.router.navigateByUrl('/canteens/food-items');
    };
}

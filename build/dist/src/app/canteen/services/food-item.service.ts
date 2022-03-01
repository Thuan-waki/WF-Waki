import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INTERCEPTOR_SKIP_HEADER } from '@portal/shared/constants/common.constants';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable, of } from 'rxjs';
import { IFoodItemFilter } from '../models/food-item-filter.model';
import { IFoodItem, IFoodItemCustomization, IFoodItemCustomizationOption } from '../models/food-item.model';

@Injectable({
    providedIn: 'root'
})
export class FoodItemService {
    constructor(private httpClient: HttpClient) {}

    getFoodItems = (canteenId: string, filter?: IFoodItemFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/canteens/${canteenId}/food-items?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getFoodItem = (canteenId: string, foodItemId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`/api/v2/canteens/${canteenId}/food-items/${foodItemId}`);
    };

    postFoodItem = (canteenId: string, foodItem: IFoodItem, file?: string): Observable<HttpEvent<IApiResult>> => {
        const formData = new FormData();

        if (file && file.length) {
            formData.append('foodImage', this.b64toBlob(file));
        }

        formData.append('postData', JSON.stringify(foodItem));

        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.post<IApiResult>(`api/v2/canteens/${canteenId}/food-items`, formData, {
            headers: headers.append(INTERCEPTOR_SKIP_HEADER, ''),
            reportProgress: true,
            observe: 'events'
        });
    };

    patchFoodItem = (
        canteenId: string,
        foodItemId: string,
        foodItem: IFoodItem,
        file?: string
    ): Observable<HttpEvent<IApiResult>> => {
        const formData = new FormData();

        if (file && file.length) {
            formData.append('foodImage', this.b64toBlob(file), 'foodItem.png');
        }

        formData.append('postData', JSON.stringify(foodItem));

        const headers = new HttpHeaders();

        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.patch<IApiResult>(`api/v2/canteens/${canteenId}/food-items/${foodItemId}`, formData, {
            headers: headers.append(INTERCEPTOR_SKIP_HEADER, ''),
            reportProgress: true,
            observe: 'events'
        });
    };

    newFoodItem = (): Observable<IFoodItem> => {
        const foodItem: IFoodItem = {
            _id: '',
            calories: 0,
            availableQuantity: 0,
            maxQuantityForOrder: 0,
            pricePerItem: 0,
            translations: {
                en: '',
                ar: ''
            },
            customizations: []
        };

        return of(foodItem);
    };

    newFoodItemCustomization = (): Observable<IFoodItemCustomization> => {
        const foodItemCustomization: IFoodItemCustomization = {
            customizationType: 'SINGLE_CHOICE',
            translations: {
                ar: '',
                en: ''
            },
            options: []
        };

        return of(foodItemCustomization);
    };

    newFoodItemCustomizationOption = (): Observable<IFoodItemCustomizationOption> => {
        const foodItemCustomizationOption: IFoodItemCustomizationOption = {
            extraPrice: 0,
            hasExtraPrice: false,
            translations: {
                en: '',
                ar: ''
            }
        };

        return of(foodItemCustomizationOption);
    };

    b64toBlob = (b64Data: string, contentType = 'image/png', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
}

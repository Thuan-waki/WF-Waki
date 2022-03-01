import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IFoodOrderFilter } from '../models/food-order-filter.model';

@Injectable({
    providedIn: 'root'
})
export class FoodOrderService {
    constructor(private httpClient: HttpClient) { }

    getFoodOrders = (canteenId: string, filter?: IFoodOrderFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/canteens/${canteenId}/food-orders?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.school && filter?.school.length) {
            url = url.concat('&school=', filter.school);
        }

        if (filter?.orderStatus) {
            url = url.concat(`&orderStatus=${filter.orderStatus}`);
        }

        if (filter?.orderType) {
            url = url.concat(`&orderType=${filter.orderType}`);
        }

        if (filter?.orderFromDate?.toString().length) {
            url = url.concat(`&orderFromDate=${GetDisplayDate(new Date(filter.orderFromDate))}`);
        }

        if (filter?.orderToDate?.toString().length) {
            url = url.concat(`&orderToDate=${GetDisplayDate(new Date(filter.orderToDate))}`);
        }

        if (filter?.fromDate?.toString().length) {
            url = url.concat(`&fromDate=${GetDisplayDate(new Date(filter.fromDate))}`);
        }

        if (filter?.toDate?.toString().length) {
            url = url.concat(`&toDate=${GetDisplayDate(new Date(filter.toDate))}`);
        }

        if (filter?.gender?.length) {
            url = url.concat(`&sex=${filter.gender}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    markAllDelivered = (canteenId: string, selectedDate: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/canteens/${canteenId}/food-orders/multi-actions`, {
            action: 'DELIVERED',
            orderDate: selectedDate
        });
    };

    markAllRejected = (canteenId: string, selectedDate: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/canteens/${canteenId}/food-orders/multi-actions`, {
            action: 'REJECTED',
            orderDate: selectedDate
        });
    };

    markOrdersAs = (canteenId: string, ids: string[], action: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/canteens/${canteenId}/food-orders/multi-actions`, {
            action,
            foodOrderIds: ids
        });
    };
}

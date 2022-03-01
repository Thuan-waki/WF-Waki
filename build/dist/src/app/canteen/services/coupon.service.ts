import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ICouponOrderFilter } from '../models/coupon-order.model';
import { CouponStatuses, ICoupon, ICouponFilter } from '../models/coupon.model';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    constructor(private httpClient: HttpClient) {}

    getCoupons = (filter?: ICouponFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/coupons?`
            .concat(`page=${(filter?.page || 1).toString()}`)
            .concat(`&limit=${(filter?.limit || 10).toString()}`);

        if (filter?.search) {
            url = url.concat(`&search=${filter?.search}`);
        }

        if (filter?.canteen) {
            url = url.concat(`&canteen=${filter.canteen}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getCoupon = (id: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/coupons/${id}`);
    };

    getSelectCoupons = (select: string[]): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/coupons?select=${(select || []).join(',')}`);
    };

    getCouponOrders = (filter?: ICouponOrderFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `api/v2/coupon-orders?`
            .concat(`fromDate=${GetDisplayDate(filter?.fromDate)}`)
            .concat(`&toDate=${GetDisplayDate(filter?.toDate)}`);

        if (filter?.school && filter?.school?.length) {
            url = url.concat(`&school=${filter.school}`);
        }

        if (filter?.canteen && filter?.canteen?.length) {
            url = url.concat(`&canteen=${filter.canteen}`);
        }

        if (filter?.student && filter?.student?.length) {
            url = url.concat(`&student=${filter.student}`);
        }

        if (filter?.search && filter?.search?.length) {
            url = url.concat(`&search=${filter.search}`);
        }

        if (filter?.coupon && filter?.coupon?.length) {
            url = url.concat(`&coupon=${filter.coupon}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    createCoupon = (coupon: ICoupon): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/coupons`, coupon);
    };

    patchCoupon = (id: string, coupon: ICoupon): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/coupons/${id}`, coupon);
    };

    approveCoupon = (id: string, wakiFeePercentage: number): Observable<IApiResult> => {
        const body = {
            status: CouponStatuses.Approved,
            wakiFeePercentage: wakiFeePercentage
        };

        return this.httpClient.patch<IApiResult>(`api/v2/coupons/${id}`, body);
    };

    rejectCoupon = (id: string): Observable<IApiResult> => {
        const body = {
            status: CouponStatuses.Rejected,
            wakiFeePercentage: 0
        };

        return this.httpClient.patch<IApiResult>(`api/v2/coupons/${id}`, body);
    };

    publishOrUnpublishCoupon = (id: string, isPublished: boolean) => {
        const body = {
            isPublished: isPublished
        };

        return this.httpClient.patch<IApiResult>(`api/v2/coupons/${id}`, body);
    };
}

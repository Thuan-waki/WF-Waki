import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ICanteenMenu, ICanteenMenuFilter } from '../models/canteen-menu.model';

@Injectable({
    providedIn: 'root'
})
export class CanteenMenuService {
    constructor(private httpClient: HttpClient) {}

    getCanteenMenus = (canteenId: string, filter?: ICanteenMenuFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/canteens/${canteenId}/canteen-menus?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.school && filter?.school.length) {
            url = url.concat('&school=', filter.school);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getCanteenMenu = (canteenId: string, menuId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`/api/v2/canteens/${canteenId}/canteen-menus/${menuId}`);
    };

    postCanteenMenu = (canteenId: string, menu: ICanteenMenu): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`/api/v2/canteens/${canteenId}/canteen-menus`, menu);
    };

    patchCanteenMenu = (canteenId: string, menuId: string, menu: ICanteenMenu): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`/api/v2/canteens/${canteenId}/canteen-menus/${menuId}`, menu);
    };
}

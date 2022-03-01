import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ICanteenFilter } from '../models/canteen-filter.model';
import { ICanteen } from '../models/canteen.model';

@Injectable({
    providedIn: 'root'
})
export class CanteenService {
    constructor(private httpClient: HttpClient) {}

    getCanteens = (filter?: ICanteenFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/canteens?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getCanteen = (canteenId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/canteens/${canteenId}`);
    };

    getSelectCanteens = (select: string[], schoolId?: string): Observable<IApiResult> => {
        let uri = `api/v2/canteens?select=${(select || []).join(',')}`;

        if (schoolId?.length) {
            uri = uri.concat(`&school=${schoolId}`);
        }

        return this.httpClient.get<IApiResult>(uri);
    };

    lookupCanteen = (canteenId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/canteens/lookup?canteenId=${canteenId}`);
    };

    createCanteen = (canteen: ICanteen): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/canteens`, canteen);
    };

    patchCanteen = (id: string, canteen: ICanteen): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/canteens/${id}`, canteen);
    };
}

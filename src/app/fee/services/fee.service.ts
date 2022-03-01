import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IFeeFilter } from '../models/fee.model';

@Injectable({
    providedIn: 'root'
})
export class FeeService {
    constructor(private httpClient: HttpClient) {}

    getFees = (filter: IFeeFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/fees?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString())
            .concat(`&canteen=${filter.canteen}`);

        if (filter?.fromDate?.toString().length) {
            url = url.concat(`&fromDate=${GetDisplayDate(new Date(filter.fromDate))}`);
        }

        if (filter?.toDate?.toString().length) {
            url = url.concat(`&toDate=${GetDisplayDate(new Date(filter.toDate))}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };
}

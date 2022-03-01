import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IRequestFilter } from '../../shared/models/request-filter.model';

@Injectable({
    providedIn: 'root'
})
export class TransferRequestService {
    constructor(private httpClient: HttpClient) {}

    getTransferRequests = (filter?: IRequestFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/requests?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString())
            .concat('&requestType=', filter?.requestType || '')
            .concat('&canteen=', filter?.canteen || '')
            .concat('&fromDate=', GetDisplayDate(filter!.fromDate))
            .concat('&toDate=', GetDisplayDate(filter!.toDate));

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { defaultRefundRequestFilter, IRequestFilter } from '@portal/shared/models/request-filter.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RefundRequestService {
    constructor(private httpClient: HttpClient) {}

    getRefundRequest = (filter?: IRequestFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/requests?`
            .concat('requestType=', defaultRefundRequestFilter.requestType)
            .concat('&page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString())
            .concat('&fromDate=', GetDisplayDate(filter!.fromDate))
            .concat('&toDate=', GetDisplayDate(filter!.toDate));

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    updateStatus = (refundRequestId: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/requests/${refundRequestId}/update-status`, {
            rqStatus: 'TRANSFERRED'
        });
    };
}

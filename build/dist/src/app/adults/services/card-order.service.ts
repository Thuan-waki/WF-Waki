import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ICardOrderFilter } from '../models/card-order-filter.model';

@Injectable({
    providedIn: 'root'
})
export class CardOrderService {
    constructor(private httpClient: HttpClient) {}

    getCardOrders = (filter?: ICardOrderFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/card-orders?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString())
            .concat('&fromDate=', GetDisplayDate(filter!.fromDate))
            .concat('&toDate=', GetDisplayDate(filter!.toDate));

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.school && filter.school.length) {
            url = url.concat(`&school=${filter.school}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    approveCard = (cardOrderId: string, cardId: string, cardSerialNo: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/card-orders/${cardOrderId}`, {
            orderStatus: 'DELIVERED',
            cardId: cardId,
            cardSerialNo: cardSerialNo
        });
    };
}

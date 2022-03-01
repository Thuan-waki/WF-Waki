import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ITransactionFilter } from '../models/transaction-filter.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getTransactions = (filter: ITransactionFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/transactions?`
            .concat(`fromDate=${GetDisplayDate(filter.fromDate)}`)
            .concat(`&toDate=${GetDisplayDate(filter.toDate)}`)
            .concat(`&page=${filter.page}`)
            .concat(`&limit=${filter.limit}`);

        if (filter.userType && filter.userType.length) {
            url = url.concat(`&pg=${filter.userType}`);
        }

        if (filter.school && filter.school.length) {
            url = url.concat(`&school=${filter.school}`);
        }

        if (filter.canteen && filter.canteen.length) {
            url = url.concat(`&canteen=${filter.canteen}`);
        }

        if (filter.trType && filter.trType?.length) {
            url = url.concat(`&trType=${filter.trType}`);
        }

        if (filter.search) {
            url = url.concat(`&search=${filter.search}`);
        }

        if (filter.parent && filter.parent.length) {
            url = url.concat(`&parent=${filter.parent}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };
}

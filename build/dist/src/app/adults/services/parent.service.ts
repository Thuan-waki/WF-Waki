import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IParent, IParentFilter } from '../models/parent.model';

@Injectable({
    providedIn: 'root'
})
export class ParentService {
    constructor(private httpClient: HttpClient) {}

    getParents = (filter?: IParentFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/parents?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getParent = (id: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/parents/${id}`);
    };

    getSelectParents = (select: string[]): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/parents?select=${(select || []).join(',')}`);
    };

    postParent = (parent: IParent): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/parents`, parent);
    };

    patchParent = (id: string, parent: IParent): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/parents/${id}`, parent);
    };
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IUserFilter } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private httpClient: HttpClient) {}

    getUsers = (filter?: IUserFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/users?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.schoolId && filter?.schoolId?.length) {
            url = url.concat('&school=', filter.schoolId);
        }

        if (filter?.roles && filter.roles.length) {
            url = url.concat(`&roles=${filter.roles}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getUser = (userId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/users/${userId}`);
    };

    postUser = (user: any): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/users`, user);
    };

    patchUser = (userId: string, user: any): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/users/${userId}`, user);
    };

    toggleCardStatus = (userId: string, cardStatus: 'ACTIVE' | 'INACTIVE') => {
        return this.httpClient.patch(`api/v2/users/${userId}`, { cardStatus: cardStatus });
    };
}

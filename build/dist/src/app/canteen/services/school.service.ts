import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SchoolService {
    constructor(private httpClient: HttpClient) {}

    getSchools = (): Observable<IApiResult> => {
        const url = '/api/v2/schools?select=translations';
        return this.httpClient.get<IApiResult>(url);
    };
}

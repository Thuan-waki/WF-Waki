import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResult } from '../models/api-result.model';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private httpClient: HttpClient) {}

    getCountries = (): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`/api/v2/users/countries`);
    };

    getCities = (countryId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/users/cities?country=${countryId}`);
    };
}

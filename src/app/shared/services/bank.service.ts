import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResult } from '../models/api-result.model';

@Injectable({
    providedIn: 'root'
})
export class BankService {
    constructor(private httpClient: HttpClient) {}

    getBanks = (): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`/api/v2/banks`);
    };
}

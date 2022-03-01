import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    constructor(private httpClient: HttpClient) {}

    getDevices = (schoolId: string): Observable<IApiResult> => {
        let url = `api/v2/schools/${schoolId}/physicalDevices`;

        return this.httpClient.get<IApiResult>(url);
    };
}

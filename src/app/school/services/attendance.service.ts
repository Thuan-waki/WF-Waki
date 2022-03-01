import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDisplayDate } from '@portal/shared/functions/get-display-date';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IAttendanceFilter } from '../models/attendance.model';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    constructor(private httpClient: HttpClient) {}

    getAttendances = (schoolId: string, filter: IAttendanceFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `api/v2/schools/${schoolId}/attendance?`
            .concat(`fromDate=${GetDisplayDate(filter.fromDate)}`)
            .concat(`&toDate=${GetDisplayDate(filter.toDate)}`)
            .concat(`&page=${filter.page}`)
            .concat(`&limit=${filter.limit}`);

        if (filter.search) {
            url = url.concat(`&search=${filter.search}`);
        }

        if (filter.school && filter.school.length) {
            url = url.concat(`&school=${filter.school}`);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };
}

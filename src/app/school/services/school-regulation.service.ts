import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { ISchoolRegulation } from '../models/school-regulation.model';

@Injectable({
    providedIn: 'root'
})
export class SchoolRegulationService {
    constructor(private httpClient: HttpClient) {}

    getRegulation = (schoolId: string, gradeId: string): Observable<IApiResult> => {
        let url = `api/v2/schools/${schoolId}/grades/${gradeId}`;

        return this.httpClient.get<IApiResult>(url);
    };

    create = (schoolId: string, gradeId: string, regulation: ISchoolRegulation): Observable<IApiResult> => {
        let url = `api/v2/schools/${schoolId}/grades/${gradeId}/regulations`;

        return this.httpClient.post<IApiResult>(url, regulation);
    };

    patch = (
        schoolId: string,
        gradeId: string,
        regulationId: string,
        regulation: ISchoolRegulation
    ): Observable<IApiResult> => {
        let url = `api/v2/schools/${schoolId}/grades/${gradeId}/regulations/${regulationId}`;

        return this.httpClient.patch<IApiResult>(url, regulation);
    };
}

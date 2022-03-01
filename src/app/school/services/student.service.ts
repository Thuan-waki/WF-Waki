import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IStudentFilter } from '../models/student-filter.model';
import { IStudent } from '../models/student.model';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    constructor(private httpClient: HttpClient) {}

    getStudents = (filter?: IStudentFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/students?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        if (filter?.schoolId && filter?.schoolId?.length) {
            url = url.concat('&schoolId=', filter.schoolId);
        }

        if (filter?.gradeId && filter?.gradeId?.length) {
            url = url.concat('&gradeId=', filter.gradeId);
        }

        if (filter?.school) {
            url = url.concat('&school=', filter.school);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getStudent = (studentId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/students/${studentId}`);
    };

    getSelectStudents = (select: string[]): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/students?select=${(select || []).join(',')}`);
    };

    getParent = (studentId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/students/${studentId}/parents`);
    };

    postStudent = (student: IStudent): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/students`, student);
    };

    patchStudent = (studentId: string, student: IStudent): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/students/${studentId}`, student);
    };

    deleteStudent = (studentId: string): Observable<IApiResult> => {
        return this.httpClient.delete<IApiResult>(`api/v2/students/${studentId}`);
    };
}

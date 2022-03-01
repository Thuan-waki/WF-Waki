import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { Observable } from 'rxjs';
import { IGradeFilter } from '../models/grade.model';
import { ISchoolFilter } from '../models/school-filter.model';
import { ISchool } from '../models/school.model';

@Injectable({
    providedIn: 'root'
})
export class SchoolService {
    constructor(private httpClient: HttpClient) {}

    getSchools = (filter?: ISchoolFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/schools?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getGrades = (schoolId: string, filter: IGradeFilter): Observable<HttpResponse<IApiResult>> => {
        let url = `/api/v2/schools/${schoolId}/grades?`
            .concat('page=', (filter?.page || 1).toString())
            .concat('&limit=', (filter?.limit || 10).toString());

        if (filter?.search && filter?.search?.length) {
            url = url.concat('&search=', filter.search);
        }

        return this.httpClient.get<IApiResult>(url, { observe: 'response' });
    };

    getSelectSchools = (select: string[], canteenId?: string): Observable<IApiResult> => {
        let uri = `api/v2/schools?select=${(select || []).join(',')}`;

        if (canteenId && canteenId.length) {
            uri = uri.concat(`&canteen=${canteenId}`);
        }

        return this.httpClient.get<IApiResult>(uri);
    };

    getSchool = (schooldId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/schools/${schooldId}`);
    };

    lookupSchool = (schoolId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/schools?schoolRegistrationCode=${schoolId}`);
    };

    createSchool = (school: ISchool): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`api/v2/schools`, school);
    };

    patchSchool = (schoolId: string, school: ISchool): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`api/v2/schools/${schoolId}`, school);
    };

    getGrade = (schoolId: string, gradeId: string): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`/api/v2/schools/${schoolId}/grades/${gradeId}`);
    };

    getSelectGrades = (schoolId: string, select: string[]): Observable<IApiResult> => {
        return this.httpClient.get<IApiResult>(`api/v2/schools/${schoolId}/grades?select=${(select || []).join(',')}`);
    };

    createGrade = (schoolId: string, grade: string): Observable<IApiResult> => {
        return this.httpClient.post<IApiResult>(`/api/v2/schools/${schoolId}/grades`, { grade: grade });
    };

    patchGrade = (schoolId: string, gradeId: string, grade: string): Observable<IApiResult> => {
        return this.httpClient.patch<IApiResult>(`/api/v2/schools/${schoolId}/grades/${gradeId}`, { grade: grade });
    };

    emptySchool = (): ISchool => {
        const school: ISchool = {
            address: '',
            canteens: [],
            createdAt: new Date(),
            createdBy: '',
            creditLimit: 0,
            currency: '',
            currentAttendanceSubscriptionEnds: new Date(),
            currentAttendanceSubscriptionStarts: new Date(),
            currentSubscriptionEnds: new Date(),
            currentSubscriptionStarts: new Date(),
            email: '',
            hasAttendanceAccess: false,
            hasCanteenAccess: false,
            hasUpdatedStudentData: false,
            id: '',
            initDailyPurchase: 0,
            isDeleted: false,
            isValid: false,
            mobileNo: '',
            phone: '',
            physicalDevices: [],
            schoolName: '',
            schoolRegistrationCode: '',
            updatedAt: new Date(),
            vat: '',
            subscriptionHistory: [],
            translations: {
                en: '',
                ar: ''
            },
            _id: ''
        };

        return school;
    };
}

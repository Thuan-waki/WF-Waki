import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultSchoolFilter, ISchoolFilter } from '@portal/school/models/school-filter.model';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { YesNoBooleanPipe } from '@portal/shared/pipes/yes-no-boolean.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-school-list-page',
    templateUrl: './school-list-page.component.html',
    styleUrls: ['./school-list-page.component.scss']
})
export class SchoolListPageComponent extends ComponentBase implements OnInit {
    schools: ISchool[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultSchoolFilter.limit || 50;
    constructor(
        private schoolService: SchoolService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private router: Router,
        private yesNoPipe: YesNoBooleanPipe,
        private utilitesService: UtilitiesService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getSchools(defaultSchoolFilter);
    }

    getSchools = (filter: ISchoolFilter) => {
        this.isLoading = true;
        this.schools = [];

        this.schoolService
            .getSchools(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.schools = result.body?.schools || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve schools', 'Schools');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to retrieve schools', 'Schools');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    newSchool = () => {
        this.router.navigate(['/schools/form']);
    };

    editSchool = (schoolId: string) => {
        this.router.navigate([`/schools/form/${schoolId}`]);
    };

    exportToExcel = () => {
        const rows = this.schools.map((row) => {
            const r: any = {};

            r['School Registration'] = row.schoolRegistrationCode;
            r['School Name EN'] = row.translations?.en;
            r['School Name AR'] = row.translations?.ar;
            r['Email'] = row.email;
            r['Phone'] = row.phone;
            r['Mobile Number'] = row.mobileNo;
            r['Attendance Service'] = this.yesNoPipe.transform(row.hasAttendanceAccess);
            r['Canteen Service'] = this.yesNoPipe.transform(row.hasCanteenAccess);
            r['City'] = row.city;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitesService.generateExcelFileName(`Schools`));
    };
}

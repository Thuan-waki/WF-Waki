import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultGradeFilter, IGrade, IGradeFilter } from '@portal/school/models/grade.model';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-class-list-page',
    templateUrl: './class-list-page.component.html',
    styleUrls: ['./class-list-page.component.scss']
})
export class ClassListPageComponent extends ComponentBase {
    grades: IGrade[] = [];
    schools: ISchool[] = [];
    schoolOptions: any[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultGradeFilter.limit || 50;
    isAdmin: boolean = false;

    constructor(
        private schoolService: SchoolService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private router: Router,
        private utilitiesService: UtilitiesService
    ) {
        super();

        this.isAdmin = this.authService.isAdminOrSuperAdmin();

        if (this.isAdmin) {
            this.getSchools();
        } else {
            const isSchoolUser = this.authService.isSuperSchoolUser() || this.authService.isSchoolUser();
            const userSchoolId = this.authService.getUserSchoolId();

            if (isSchoolUser && userSchoolId) {
                this.getGrades({ ...defaultGradeFilter, school: this.authService.getUserSchoolId() });
            } else {
                this.isLoading = false;
            }
        }
    }

    getSchools = () => {
        this.schoolService
            .getSelectSchools(['id', 'translations'])
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.schoolOptions = (result.schools || []).map((school) => {
                            return {
                                label: translationLang(school?.translations),
                                value: school?._id
                            };
                        });

                        if (this.schoolOptions.length > 0) {
                            this.getGrades({ ...defaultGradeFilter, school: this.schoolOptions[0].value });
                        }
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getGrades = (filter?: IGradeFilter) => {
        this.isLoading = true;

        this.schoolService
            .getGrades(filter?.school || '', filter || defaultGradeFilter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    this.grades = result.body?.grades || [];
                    this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                    const numberOfPages = this.recordCount / this.pageSize;
                    this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve grades', 'Grade');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    addClass = () => {
        this.router.navigate([`/schools/classes/form`]);
    };

    editClass = (grade: IGrade) => {
        this.router.navigate(['/schools/classes/form'], {
            queryParams: { schoolId: grade.school, gradeId: grade._id }
        });
    };

    exportToExcel = () => {
        const rows = this.grades.map((row) => {
            const r: any = {};

            r['School Name'] = this.schoolOptions.find((school) => school.value === row.school)?.label || '';
            r['Class Name'] = row.grade;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Classes`));
    };
}

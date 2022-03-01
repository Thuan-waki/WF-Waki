import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultStudentFilter, IStudentFilter } from '@portal/school/models/student-filter.model';
import { IStudent } from '@portal/school/models/student.model';
import { SchoolService } from '@portal/school/services/school.service';
import { StudentService } from '@portal/school/services/student.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-student-list-page',
    templateUrl: './student-list-page.component.html',
    styleUrls: ['./student-list-page.component.scss']
})
export class StudentListPageComponent extends ComponentBase {
    students: IStudent[] = [];
    schoolOptions: any[] = [];
    isLoading = true;
    isAdmin = false;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultStudentFilter.limit || 50;

    constructor(
        private studentService: StudentService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private router: Router,
        private utilitiesService: UtilitiesService
    ) {
        super();

        this.isAdmin = this.authService.isAdminOrSuperAdmin();


        this.getStudents(defaultStudentFilter);

        if (this.isAdmin) {
            this.getSchools();
        }
    }

    getStudents = (filter: IStudentFilter) => {
        this.isLoading = true;
        this.students = [];

        this.studentService
            .getStudents(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.students = result.body?.students || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve students', 'Students');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to retrieve students', 'Students');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

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
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    newStudent = () => {
        this.router.navigate(['/students/form']);
    };

    editStudent = (id: string) => {
        this.router.navigate([`/schools/students/form/${id}`], { state: { origin: 'students' } });
    };

    exportToExcel = () => {
        const rows = this.students.map((row) => {
            const r: any = {};

            r['National ID'] = row.nationalId;
            r['Student Name EN'] = row.translations?.en || '';
            r['Student Name AR'] = row.translations?.ar || '';
            r['Class'] = row.grade?.grade || '';
            r['Section'] = row.section || '';
            r['Gender'] = row.sex;
            r['Card ID'] = '';
            r['Email'] = row.user?.email || '';
            r['School'] = translationLang(row.school?.translations);

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`Students`));
    };
}

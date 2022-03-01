import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { defaultStudentFilter, IStudentFilter } from '@portal/school/models/student-filter.model';
import { IStudent } from '@portal/school/models/student.model';
import { SchoolService } from '@portal/school/services/school.service';
import { StudentService } from '@portal/school/services/student.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { DialogType } from '@portal/shared/enums/dialog-type.enum';
import { selectOptions } from '@portal/shared/functions/get-select-options';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { DialogService } from '@portal/shared/services/dialog.service';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-dependant-list-page',
    templateUrl: './dependant-list-page.component.html',
    styleUrls: ['./dependant-list-page.component.scss']
})
export class DependantListPageComponent extends ComponentBase {
    dependants: IStudent[] = [];
    schoolOptions: any[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultStudentFilter.limit || 50;

    constructor(
        private studentService: StudentService,
        private schoolService: SchoolService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private wakiDatePipe: WakiDatePipe,
        private router: Router,
        private dialogService: DialogService,
        private utilitesService: UtilitiesService
    ) {
        super();
        this.getStudents(defaultStudentFilter);
        this.getSchools();
    }

    getStudents = (filter: IStudentFilter) => {
        this.isLoading = true;
        this.dependants = [];

        this.studentService
            .getStudents(filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.dependants = result.body?.students || [];
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
                        this.schoolOptions = selectOptions(result.schools || []);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    editDependent = (id: string) => {
        this.router.navigate([`/schools/students/form/${id}`], { state: { origin: 'dependants' } });
    };

    deleteDependent = (id: string) => {
        this.dialogService
            .confirm(
                'Delete Dependent',
                'Delete Dependant?<br />Click confirm to delete Dependent',
                'Confirm',
                'Cancel',
                DialogType.Warning
            )
            .pipe(
                tap((res: any) => {
                    if (res) {
                        this.studentService
                            .deleteStudent(id)
                            .pipe(
                                tap((res: IApiResult) => {
                                    if (res.success) {
                                        this.toastr.success('Delete success', 'Delete');
                                    }
                                }),
                                takeUntil(this.destroyed$),
                                catchError(() => {
                                    this.toastr.error('Delete Dependent failed', 'Delete Failure');
                                    return of();
                                })
                            )
                            .subscribe();
                    }
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    };

    exportToExcel = () => {
        const rows = this.dependants.map((row) => {
            const r: any = {};

            r['NID'] = row.nationalId;
            r['Dependent Name EN'] = row.translations?.en || '';
            r['Dependent Name AR'] = row.translations?.ar || '';
            r['Date of Birth'] = this.wakiDatePipe.transform(row.dob);
            r['Gender'] = row.sex;
            r['Email'] = row.user?.email;
            r['School Name'] = translationLang(row.school?.translations);
            r['Adult Name'] = translationLang(row.adult?.translations);

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitesService.generateExcelFileName(`Dependents`));
    };
}

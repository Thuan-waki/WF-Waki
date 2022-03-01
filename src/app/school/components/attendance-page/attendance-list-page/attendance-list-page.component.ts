import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { defaultAttendanceFilter, IAttendance, IAttendanceFilter } from '@portal/school/models/attendance.model';
import { AttendanceService } from '@portal/school/services/attendance.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { WakiDatePipe } from '@portal/shared/pipes/waki-date.pipe';
import { YesNoBooleanPipe } from '@portal/shared/pipes/yes-no-boolean.pipe';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-attendance-list-page',
    templateUrl: './attendance-list-page.component.html',
    styleUrls: ['./attendance-list-page.component.scss']
})
export class AttendanceListPageComponent extends ComponentBase {
    currenUserSchoolId = '';
    isAdmin = false;
    attendances: IAttendance[] = [];
    schoolOptions: ISelectOption[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultAttendanceFilter.limit || 50;

    constructor(
        private attendanceService: AttendanceService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private utilitiesService: UtilitiesService,
        private yesNoBooleanPipe: YesNoBooleanPipe,
        private wakiDatePipe: WakiDatePipe
    ) {
        super();
        this.currenUserSchoolId = this.authService.getUserSchoolId();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();
        const isSchoolUser = this.authService.isSchoolUser() || this.authService.isSuperSchoolUser();

        if (!this.isAdmin && !isSchoolUser) {
            this.toastr.error('Unauthorized');
            this.isLoading = false;
        } else if (this.currenUserSchoolId && !this.isAdmin) {
            this.getAttendances({ ...defaultAttendanceFilter, school: this.currenUserSchoolId });
        } else if (this.isAdmin) {
            this.getSelectSchools();
        } else {
            this.isLoading = false;
        }
    }

    getSelectSchools = () => {
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
                            this.getAttendances({ ...defaultAttendanceFilter, school: this.schoolOptions[0].value });
                        }
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getAttendances = (filter: IAttendanceFilter) => {
        this.isLoading = true;

        this.attendanceService
            .getAttendances(filter.school!, filter)
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.attendances = result.body?.attendance || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve Attendance', 'Attendance');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    exportToExcel = (schoolName: string) => {
        const rows = this.attendances.map((row) => {
            const r: any = {};

            r['Student Name EN'] = row.student?.translations?.en;
            r['Student Name AR'] = row.student?.translations?.ar;
            r['Check In Date'] = this.wakiDatePipe.transform(row.atCheckIn);
            r['Is Early'] = this.yesNoBooleanPipe.transform(row.isEarly);
            r['Is Late'] = this.yesNoBooleanPipe.transform(row.isLate);
            r['Is Absent'] = this.yesNoBooleanPipe.transform(row.isAbsent);
            r['Device SN'] = row.deviceSN;
            r['Card or FP ID'] = row.cardOrFpId;

            return r;
        });

        this.excelExportService.exportExcel(
            rows,
            this.utilitiesService.generateExcelFileName(`${schoolName}_Attendance`)
        );
    };
}

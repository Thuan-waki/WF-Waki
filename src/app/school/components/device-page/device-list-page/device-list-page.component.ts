import { Component } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { IDevice } from '@portal/school/models/device.model';
import { DeviceService } from '@portal/school/services/device.service';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IApiResult } from '@portal/shared/models/api-result.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { UtilitiesService } from '@portal/shared/services/utilites.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-device-list-page',
    templateUrl: './device-list-page.component.html',
    styleUrls: ['./device-list-page.component.scss']
})
export class DeviceListPageComponent extends ComponentBase {
    currenUserSchoolId = '';
    isAdmin = false;
    devices: IDevice[] = [];
    schoolOptions: ISelectOption[] = [];
    isLoading = true;

    constructor(
        private deviceService: DeviceService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private toastr: ToastrService,
        private excelExportService: ExcelExportService,
        private utilitiesService: UtilitiesService
    ) {
        super();
        this.currenUserSchoolId = this.authService.getUserSchoolId();
        this.isAdmin = this.authService.isAdminOrSuperAdmin();

        if (this.currenUserSchoolId && !this.isAdmin) {
            this.getDevices(this.currenUserSchoolId);
        } else {
            this.getSelectSchools();
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
                            this.getDevices(this.schoolOptions[0].value);
                        }
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    getDevices = (schoolId: string) => {
        this.isLoading = true;

        this.deviceService
            .getDevices(schoolId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.devices = result.physicalDevices || [];
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.toastr.error('Failed to retrieve Devices', 'Device');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    exportToExcel = (schoolName: string) => {
        const rows = this.devices.map((row) => {
            const r: any = {};

            r['Device Type'] = row.deviceType;
            r['Device Serial Number'] = row.deviceSerialNo;
            r['School'] = schoolName;
            r['Location'] = row.location;

            return r;
        });

        this.excelExportService.exportExcel(rows, this.utilitiesService.generateExcelFileName(`${schoolName}_Devices`));
    };
}

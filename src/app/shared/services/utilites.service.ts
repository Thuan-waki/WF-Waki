/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { UserRoles } from '../constants/user-roles.constants';
import { WakiDatePipe } from '../pipes/waki-date.pipe';
import { SharedModule } from '../shared.module';

@Injectable({
    providedIn: SharedModule
})
export class UtilitiesService {
    constructor(private wakiDatePipe: WakiDatePipe, private authService: AuthService) {}

    getDateAndTime = (date: Date) => {
        const dateAndTime = this.wakiDatePipe.transform(date, true)?.split(' ');

        return {
            date: dateAndTime[0] || '',
            time: `${dateAndTime[1]}` || ''
        };
    };

    generateExcelFileName = (tableName: string) => {
        const currentDateTime = this.getDateAndTime(new Date());

        let fileName = `${tableName.replace(' ', '_')}_${currentDateTime.date}_${currentDateTime.time.replace(' ', '-').replace(':', '-')}`;

        const hasAdmin = this.authService.isAdminOrSuperAdmin();
        const hasCanteen = this.authService.isCanteenUser() || this.authService.isSuperCanteenUser();

        if (!hasAdmin && hasCanteen) {
            fileName = `${this.authService.getUserCanteenCode()}_${fileName}`;
        }

        return fileName;
    };
}

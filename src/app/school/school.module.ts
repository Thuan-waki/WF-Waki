import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolRoutingModule } from './school-routing.module';
import { SchoolListPageComponent } from './components/school-list-page/school-list-page.component';
import { SchoolListComponent } from './components/school-list-page/school-list/school-list.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';
import { SchoolPageComponent } from './components/school-page.component';
import { SchoolFormPageComponent } from './components/school-form-page/school-form-page.component';
import { SchoolFormComponent } from './components/school-form-page/school-form/school-form.component';
import { StudentListPageComponent } from './components/student-page/student-list-page/student-list-page.component';
import { StudentListComponent } from './components/student-page/student-list-page/student-list/student-list.component';
import { StudentPageComponent } from './components/student-page/student-page.component';
import { StudentFormPageComponent } from './components/student-page/student-form-page/student-form-page.component';
import { StudentFormComponent } from './components/student-page/student-form-page/student-form/student-form.component';
import { ClassListPageComponent } from './components/class-list-page/class-list-page.component';
import { ClassListComponent } from './components/class-list-page/class-list/class-list.component';
import { ClassFormPageComponent } from './components/class-form-page/class-form-page.component';
import { ClassFormComponent } from './components/class-form-page/class-form/class-form.component';
import { AttendanceListPageComponent } from './components/attendance-page/attendance-list-page/attendance-list-page.component';
import { AttendanceListComponent } from './components/attendance-page/attendance-list-page/attendance-list/attendance-list.component';
import { DevicePageComponent } from './components/device-page/device-page.component';
import { DeviceListPageComponent } from './components/device-page/device-list-page/device-list-page.component';
import { DeviceListComponent } from './components/device-page/device-list-page/device-list/device-list.component';
import { AttendancePageComponent } from './components/attendance-page/attendance-page.component';
import { RegulationDialogComponentComponent } from './components/regulation-dialog-component/regulation-dialog-component.component';
import { CanteenSalesListPageComponent } from './components/canteen-sales-page/canteen-sales-list-page/canteen-sales-list-page.component';
import { CanteenSalesListComponent } from './components/canteen-sales-page/canteen-sales-list-page/canteen-sales-list/canteen-sales-list.component';
import { CanteenSalesPageComponent } from './components/canteen-sales-page/canteen-sales-page.component';

const COMPONENTS = [
    SchoolPageComponent,
    SchoolListPageComponent,
    SchoolListComponent,
    SchoolFormPageComponent,
    SchoolFormComponent,
    StudentPageComponent,
    StudentListPageComponent,
    StudentListComponent,
    StudentFormPageComponent,
    StudentFormComponent,
    ClassListPageComponent,
    ClassListComponent,
    ClassFormPageComponent,
    ClassFormComponent,
    AttendancePageComponent,
    AttendanceListPageComponent,
    AttendanceListComponent,
    DevicePageComponent,
    DeviceListPageComponent,
    DeviceListComponent,
    RegulationDialogComponentComponent,
    CanteenSalesListPageComponent,
    CanteenSalesListComponent,
    CanteenSalesPageComponent
];

@NgModule({
    imports: [CommonModule, SchoolRoutingModule, SharedModule, SharedComponentModule],
    exports: [COMPONENTS],
    declarations: [COMPONENTS]
})
export class SchoolModule {}

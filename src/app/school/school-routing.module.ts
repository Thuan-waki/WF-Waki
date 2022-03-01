import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceListPageComponent } from './components/attendance-page/attendance-list-page/attendance-list-page.component';
import { AttendancePageComponent } from './components/attendance-page/attendance-page.component';
import { CanteenSalesListPageComponent } from './components/canteen-sales-page/canteen-sales-list-page/canteen-sales-list-page.component';
import { CanteenSalesPageComponent } from './components/canteen-sales-page/canteen-sales-page.component';
import { ClassFormPageComponent } from './components/class-form-page/class-form-page.component';
import { ClassListPageComponent } from './components/class-list-page/class-list-page.component';
import { DeviceListPageComponent } from './components/device-page/device-list-page/device-list-page.component';
import { DevicePageComponent } from './components/device-page/device-page.component';
import { SchoolFormPageComponent } from './components/school-form-page/school-form-page.component';
import { SchoolListPageComponent } from './components/school-list-page/school-list-page.component';
import { SchoolPageComponent } from './components/school-page.component';
import { StudentFormPageComponent } from './components/student-page/student-form-page/student-form-page.component';
import { StudentListPageComponent } from './components/student-page/student-list-page/student-list-page.component';
import { StudentPageComponent } from './components/student-page/student-page.component';

const routes: Routes = [
    {
        path: '',
        component: SchoolPageComponent,
        data: { breadcrumb: { label: 'Schools' } },
        children: [
            {
                path: '',
                component: SchoolListPageComponent
            },
            {
                path: 'form',
                component: SchoolFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'form/:id',
                component: SchoolFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'students',
                component: StudentPageComponent,
                data: { breadcrumb: { label: 'Students' } },
                children: [
                    {
                        path: '',
                        component: StudentListPageComponent
                    },
                    {
                        path: 'form',
                        component: StudentFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    },
                    {
                        path: 'form/:id',
                        component: StudentFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    }
                ]
            },
            {
                path: 'classes',
                data: { breadcrumb: { label: 'Classes' } },
                children: [
                    {
                        path: '',
                        component: ClassListPageComponent
                    },
                    {
                        path: 'form',
                        component: ClassFormPageComponent,
                        data: { breadcrumb: { label: 'Form' } }
                    }
                ]
            },
            {
                path: 'devices',
                component: DevicePageComponent,
                data: { breadcrumb: { label: 'Devices' } },
                children: [
                    {
                        path: '',
                        component: DeviceListPageComponent
                    }
                ]
            },
            {
                path: 'attendance',
                component: AttendancePageComponent,
                data: { breadcrumb: { label: 'Attendance' } },
                children: [
                    {
                        path: '',
                        component: AttendanceListPageComponent
                    }
                ]
            },
            {
                path: 'canteen-sales',
                component: CanteenSalesPageComponent,
                data: { breadcrumb: { label: 'Canteen Sales' } },
                children: [
                    {
                        path: '',
                        component: CanteenSalesListPageComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchoolRoutingModule {}

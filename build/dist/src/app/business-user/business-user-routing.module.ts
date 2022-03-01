import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessUserPageComponent } from './business-user-page.component';
import { BusinessUserListPageComponent } from './business-user-list-page/business-user-list-page.component';
import { BusinessUserFormPageComponent } from './business-user-form-page/business-user-form-page.component';

const routes: Routes = [
    {
        path: '',
        component: BusinessUserPageComponent,
        data: { breadcrumb: { label: 'Business Users' } },
        children: [
            {
                path: '',
                component: BusinessUserListPageComponent
            },
            {
                path: 'form',
                data: { breadcrumb: { label: 'Form' } },
                component: BusinessUserFormPageComponent
            },
            {
                path: 'form/:id',
                data: { breadcrumb: { label: 'Form' } },
                component: BusinessUserFormPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessUserRoutingModule {}

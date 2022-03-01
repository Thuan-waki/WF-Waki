import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormPageComponent } from './components/user-form-page/user-form-page.component';
import { UserListPageComponent } from './components/user-list-page/user-list-page.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { UserPageComponent } from './user-page.component';

const routes: Routes = [
    {
        path: '',
        component: UserPageComponent,
        data: { breadcrumb: { label: 'Users' } },
        children: [
            {
                path: '',
                component: UserListPageComponent,
            },
            {
                path: 'profile',
                component: UserProfilePageComponent,
                data: { breadcrumb: { label: 'Profile' } }
            },
            {
                path: 'form',
                component: UserFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            },
            {
                path: 'form/:id',
                component: UserFormPageComponent,
                data: { breadcrumb: { label: 'Form' } }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

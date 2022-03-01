import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth-guard.service';
import { LayoutComponent } from './core/components/layout/layout.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
        data: { breadcrumb: { alias: 'home', disable: true, label: '' } }
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
            },
            {
                path: 'canteens',
                loadChildren: () => import('./canteen/canteen.module').then((m) => m.CanteenModule)
            },
            {
                path: 'adults',
                loadChildren: () => import('./adults/adult.module').then((m) => m.AdultModule)
            },
            {
                path: 'schools',
                loadChildren: () => import('./school/school.module').then((m) => m.SchoolModule)
            },
            {
                path: 'business-users',
                loadChildren: () => import('./business-user/business-user.module').then((m) => m.BusinessUserModule)
            },
            {
                path: 'dependants',
                loadChildren: () => import('./dependant/dependant.module').then((m) => m.DependantModule)
            },
            {
                path: 'logs',
                loadChildren: () => import('./logs/logs.module').then((m) => m.LogsModule)
            }
        ]
    },
    {
        path: 'business-sign-up',
        loadChildren: () => import('./canteen-sign-up/canteen-sign-up.module').then((m) => m.CanteenSignUpModule)
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

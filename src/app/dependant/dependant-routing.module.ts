import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DependantListPageComponent } from './dependant-list-page/dependant-list-page.component';
import { DependantPageComponent } from './dependant-page.component';

const routes: Routes = [
    {
        path: '',
        component: DependantPageComponent,
        data: { breadcrumb: { label: 'Dependents' } },
        children: [
            {
                path: '',
                component: DependantListPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DependantRoutingModule {}

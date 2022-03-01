import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeListPageComponent } from './components/fee-list-page/fee-list-page.component';
import { FeePageComponent } from './fee-page.component';

const routes: Routes = [
    {
        path: '',
        component: FeePageComponent,
        data: { breadcrumb: { label: 'Fees' } },
        children: [
            {
                path: '',
                component: FeeListPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeeRoutingModule {}

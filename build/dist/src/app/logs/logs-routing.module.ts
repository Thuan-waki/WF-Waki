import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsListPageComponent } from './components/logs-list-page/logs-list-page.component';
import { LogsPageComponent } from './components/logs-page.component';

const routes: Routes = [
    {
        path: '',
        component: LogsPageComponent,
        data: { breadcrumb: { label: 'Logs' } },
        children: [
            {
                path: '',
                component: LogsListPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogsRoutingModule {}

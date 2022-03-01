import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsPageComponent } from './components/logs-page.component';
import { LogsListPageComponent } from './components/logs-list-page/logs-list-page.component';
import { LogsListComponent } from './components/logs-list-page/logs-list/logs-list.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';

const COMPONENTS = [LogsPageComponent, LogsListPageComponent, LogsListComponent];

@NgModule({
    declarations: [COMPONENTS],
    imports: [CommonModule, LogsRoutingModule, SharedModule, SharedComponentModule]
})
export class LogsModule {}

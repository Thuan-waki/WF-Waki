import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DependantRoutingModule } from './dependant-routing.module';
import { DependantPageComponent } from './dependant-page.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';
import { DependantListPageComponent } from './dependant-list-page/dependant-list-page.component';
import { DependantListComponent } from './dependant-list-page/dependant-list/dependant-list.component';

const COMPONENTS = [DependantPageComponent, DependantListPageComponent, DependantListComponent];

@NgModule({
    imports: [CommonModule, DependantRoutingModule, SharedModule, SharedComponentModule],
    exports: [COMPONENTS],
    declarations: [COMPONENTS]
})
export class DependantModule {}

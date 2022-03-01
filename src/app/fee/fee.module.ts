import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeRoutingModule } from './fee-routing.module';
import { FeePageComponent } from './fee-page.component';
import { FeeListPageComponent } from './components/fee-list-page/fee-list-page.component';
import { FeeListComponent } from './components/fee-list-page/fee-list/fee-list.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';

const COMPONENTS = [FeePageComponent, FeeListPageComponent, FeeListComponent];

@NgModule({
    declarations: [COMPONENTS],
    imports: [CommonModule, FeeRoutingModule, SharedModule, SharedComponentModule],
    exports: [COMPONENTS]
})
export class FeeModule {}

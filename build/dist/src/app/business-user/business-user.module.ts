import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessUserRoutingModule } from './business-user-routing.module';
import { BusinessUserListPageComponent } from './business-user-list-page/business-user-list-page.component';
import { BusinessUserPageComponent } from './business-user-page.component';
import { BusinessUserListComponent } from './business-user-list-page/business-user-list/business-user-list.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';
import { BusinessUserFormPageComponent } from './business-user-form-page/business-user-form-page.component';
import { BusinessUserFormComponent } from './business-user-form-page/business-user-form/business-user-form.component';

const COMPONENTS = [
    BusinessUserPageComponent,
    BusinessUserListPageComponent,
    BusinessUserListComponent,
    BusinessUserFormPageComponent,
    BusinessUserFormComponent
];

@NgModule({
    imports: [CommonModule, BusinessUserRoutingModule, SharedModule, SharedComponentModule],
    declarations: [COMPONENTS],
    exports: [COMPONENTS]
})
export class BusinessUserModule {}

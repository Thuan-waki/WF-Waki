import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile-page/user-profile/user-profile.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { UserPageComponent } from './user-page.component';
import { UserListPageComponent } from './components/user-list-page/user-list-page.component';
import { UserListComponent } from './components/user-list-page/user-list/user-list.component';
import { UserFormPageComponent } from './components/user-form-page/user-form-page.component';
import { UserFormComponent } from './components/user-form-page/user-form/user-form.component';
import { SharedModule } from '@portal/shared/shared.module';
import { SharedComponentModule } from '@portal/shared/components/shared-component.module';

export const COMPONENTS = [
    UserProfileComponent,
    UserProfilePageComponent,
    UserPageComponent,
    UserListPageComponent,
    UserListComponent,
    UserFormPageComponent,
    UserFormComponent
];

@NgModule({
    imports: [CommonModule, UserRoutingModule, SharedModule, SharedComponentModule],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class UserModule {}

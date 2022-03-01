import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanteenSignUpRoutingModule } from './canteen-sign-up-routing.module';
import { CanteenSignUpPageComponent } from './canteen-sign-up-page/canteen-sign-up-page.component';
import { CanteenUserFormComponent } from './canteen-sign-up-page/canteen-user-form/canteen-user-form.component';
import { CanteenInfoFormComponent } from './canteen-sign-up-page/canteen-info-form/canteen-info-form.component';
import { CanteenSignUpOtpFormComponent } from './canteen-sign-up-page/canteen-sign-up-otp-form/canteen-sign-up-otp-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@portal/auth/auth.module';
import { CanteenSignUpStepperComponent } from './canteen-sign-up-page/canteen-sign-up-stepper/canteen-sign-up-stepper.component';

const COMPONENTS = [
    CanteenSignUpPageComponent,
    CanteenUserFormComponent,
    CanteenInfoFormComponent,
    CanteenSignUpOtpFormComponent,
    CanteenSignUpStepperComponent
];

@NgModule({
    declarations: [COMPONENTS],
    exports: [COMPONENTS],
    imports: [CommonModule, CanteenSignUpRoutingModule, FormsModule, ReactiveFormsModule, AuthModule]
})
export class CanteenSignUpModule {}

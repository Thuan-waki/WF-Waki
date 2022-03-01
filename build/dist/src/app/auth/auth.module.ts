import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LoginFormComponent } from './components/login-page/login-form/login-form.component';
import { OtpLoginPageComponent } from './components/otp-login-page/otp-login-page.component';
import { OtpLoginFormComponent } from './components/otp-login-page/otp-login-form/otp-login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './components/auth.component';
import { LoginToolbarComponent } from './components/login-toolbar/login-toolbar.component';
import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-page/forgot-password-form/forgot-password-form.component';
import { SharedModule } from '@portal/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SignUpInfoDialogComponent } from './components/sign-up-info-dialog/sign-up-info-dialog.component';

export const COMPONENTS = [
    AuthComponent,
    LoginPageComponent,
    LoginFormComponent,
    OtpLoginPageComponent,
    OtpLoginFormComponent,
    LoginToolbarComponent,
    ForgotPasswordPageComponent,
    ForgotPasswordFormComponent,
    SignUpInfoDialogComponent
];

@NgModule({
    imports: [
        CommonModule, 
        AuthRoutingModule, 
        FormsModule, 
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: [...COMPONENTS, TranslateModule]
})
export class AuthModule {}

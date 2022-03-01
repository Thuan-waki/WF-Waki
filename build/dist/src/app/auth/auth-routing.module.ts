import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth.component';
import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { OtpLoginPageComponent } from './components/otp-login-page/otp-login-page.component';

const routes: Routes = [
    {
        path: 'login',
        component: AuthComponent,
        children: [
            {
                path: '',
                component: LoginPageComponent
            },
            {
                path: 'otp',
                component: OtpLoginPageComponent
            }
        ]
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'forgot-password',
                component: ForgotPasswordPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}

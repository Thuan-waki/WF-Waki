import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanteenSignUpPageComponent } from './canteen-sign-up-page/canteen-sign-up-page.component';

const routes: Routes = [
    {
        path: '',
        component: CanteenSignUpPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CanteenSignUpRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { httpInterceptorProviders } from './http-interceptors';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NavMenuComponent } from './components/sidebar/nav-menu/nav-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@portal/shared/shared.module';

export const COMPONENTS = [LayoutComponent, SidebarComponent, ToolbarComponent, NavMenuComponent];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    providers: [httpInterceptorProviders],
    exports: [...COMPONENTS, TranslateModule]
})
export class CoreModule {}

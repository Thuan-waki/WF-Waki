import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddButtonComponent } from './add-button/add-button.component';
import { CancelButtonComponent } from './cancel-button/cancel-button.component';
import { ExportButtonComponent } from './export-button/export-button.component';
import { SaveButtonComponent } from './save-button/save-button.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExitButtonComponent } from './exit-button/exit-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { InputRequiredErrorMessageComponent } from './input-required-error-message/input-required-error-message.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { TranslateModule } from '@ngx-translate/core';

export const COMPONENTS = [
    AddButtonComponent,
    CancelButtonComponent,
    ExportButtonComponent,
    SaveButtonComponent,
    EditButtonComponent,
    ExitButtonComponent,
    PaginationComponent,
    InputRequiredErrorMessageComponent,
    ConfirmDialogComponent,
    BreadcrumbComponent
];
@NgModule({
    imports: [CommonModule, FontAwesomeModule, BreadcrumbModule, TranslateModule.forChild()],
    declarations: COMPONENTS,
    exports: [...COMPONENTS, BreadcrumbModule, TranslateModule],
    providers: [BreadcrumbService]
})
export class SharedComponentModule {}

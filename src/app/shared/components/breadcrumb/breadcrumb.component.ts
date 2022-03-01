import { Component, OnInit } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { translationLang } from '@portal/shared/functions/translate-language';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ComponentBase } from '../component-base';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends ComponentBase implements OnInit {
    data = '';

    constructor(private authService: AuthService, private breadcrumbService: BreadcrumbService) {
        super();

        if (this.authService.user.canteens && this.authService.user.canteens.length) {
            this.breadcrumbService.set(`@home`, translationLang(this.authService.user.canteens[0]?.translations));
        } else {
            this.breadcrumbService.set('@home', { skip: true });
        }
    }
}

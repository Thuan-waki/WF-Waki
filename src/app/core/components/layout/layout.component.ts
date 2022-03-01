import { Component } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '@portal/app.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    fullName: string = '';
    showSidebar: boolean = true;

    constructor(private authService: AuthService, private router: Router, private translate: TranslateService) {
        this.fullName = this.authService.user?.fullName || this.translationName;
    }

    toggleSidebar = () => {
        this.showSidebar = !this.showSidebar;
    };

    logout = () => {
        this.authService.logout();
        this.router.navigateByUrl('login');
    };

    get contentClass() {
        if (!this.showSidebar) {
            return 'full-width';
        } else {
            return AppComponent.textDir === 'rtl' ? 'remaining-rtl-width' : 'remaining-width';
        }
    }

    get translationName() {
        if (this.authService.user?.fullName) {
            return this.authService.user?.fullName;
        }
        const trans = this.authService.user?.translations;
        return trans ? this.translate.currentLang === 'en' ? trans.en : trans.ar : '';
    }
}

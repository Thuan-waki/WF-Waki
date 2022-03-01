import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';

@Component({
    selector: 'app-adult-page',
    templateUrl: './adult-page.component.html',
    styleUrls: ['./adult-page.component.scss']
})
export class AdultPageComponent {
    showHelpCenter = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        const isAdmin = this.authService.isAdminOrSuperAdmin();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd && event.url.endsWith('/card-store') && isAdmin) {
                this.showHelpCenter = true;
                return;
            }

            this.showHelpCenter = false;
        });
    }
}

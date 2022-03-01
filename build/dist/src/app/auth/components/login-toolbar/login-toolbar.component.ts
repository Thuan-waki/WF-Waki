import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '@portal/app.component';
import { environment } from 'src/environments/environment';
import { SignUpInfoDialogComponent } from '../sign-up-info-dialog/sign-up-info-dialog.component';

@Component({
    selector: 'app-login-toolbar',
    templateUrl: './login-toolbar.component.html',
    styleUrls: ['./login-toolbar.component.scss']
})
export class LoginToolbarComponent {
    isProduction = environment.production;
    currentLanguage = 'en';

    constructor(private modalService: NgbModal, public trans: TranslateService) {
        this.currentLanguage = trans.currentLang;
    }

    showSignUpInfo = () => {
        const modalRef = this.modalService.open(SignUpInfoDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.result.then(() => { }).catch();
    };

    onChangedLanguage(lang: string) {
        switch (lang) {
            case 'en':
                this.trans.use('ar');
                sessionStorage.setItem('lang', 'ar');
                this.currentLanguage = 'ar';
                break;

            default:
                this.trans.use('en');
                sessionStorage.setItem('lang', 'en');
                this.currentLanguage = 'en';
                break;
        }
        AppComponent.setBodyDir();
    }

    get dropdownClass() {
        return AppComponent.textDir === 'rtl' ? 'start' : 'end';
    }
}

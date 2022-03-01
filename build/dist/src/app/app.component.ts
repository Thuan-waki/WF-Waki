import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public static textDir: string = 'ltr';
    public app = AppComponent;
    title = 'waki-frontend';

    constructor(
        private translate: TranslateService
    ) {
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en');
        this.translate.use(sessionStorage.getItem('lang') || 'en');
        AppComponent.setBodyDir();
    }

    static setBodyDir = () => {
        if (sessionStorage.getItem('lang') === 'ar') {
            AppComponent.textDir = 'rtl';
            document.body.setAttribute("dir", "rtl");
        } else {
            AppComponent.textDir = 'ltr';
            document.body.setAttribute("dir", "ltr");
        }
    }
}

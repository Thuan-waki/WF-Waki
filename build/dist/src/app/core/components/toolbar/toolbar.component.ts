import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '@portal/app.component';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    @Input() showSidebar: boolean = false;
    @Input() username: string = '';
    @Input() langCode = sessionStorage.getItem('lang') || 'en';
    @Output() toggleSidebar = new EventEmitter();
    @Output() logout = new EventEmitter();
    currentLanguage: string;

    constructor(
        public translate: TranslateService
    ) {
        this.currentLanguage = translate.currentLang;
    }

    onChangedLanguage() {
        switch (this.translate.currentLang) {
            case 'en':
                this.translate.use('ar');
                sessionStorage.setItem('lang', 'ar');
                this.currentLanguage = 'ar';
                break;

            default:
                this.translate.use('en');
                sessionStorage.setItem('lang', 'en');
                this.currentLanguage = 'en';
                break;
        }
        AppComponent.setBodyDir();
    }

    get contentClass() {
        if (!this.showSidebar) {
            return 'full-width';
        } else {
            return this.currentLanguage === 'ar' ? 'remaining-rtl-width' : 'remaining-width';
        }
    }

    get dropdownClass() {
        return AppComponent.textDir === 'rtl' ? 'start' : 'end';
    }
}

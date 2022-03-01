import { Component } from '@angular/core';
import { AuthService } from '@portal/auth/services/auth.service';
import { translationLang } from '@portal/shared/functions/translate-language';
import { IUser } from '@portal/shared/models/user.model';

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent {
    profile: IUser | undefined;
    fullName: string = '';

    constructor(private authService: AuthService) {
        this.profile = this.authService.user;
        this.fullName = translationLang(this.authService.user?.translations);
    }
}

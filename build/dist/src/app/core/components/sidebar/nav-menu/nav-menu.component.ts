import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@portal/app.component';
import { AuthService } from '@portal/auth/services/auth.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { MenuItem } from '@portal/shared/models/menu-item.model';
import { NavMenuService } from './menu-items.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent extends ComponentBase {
    activeLinks: MenuItem[] = [];
    isAdmin = false;
    navMenus: MenuItem[] | undefined;
    app = AppComponent;

    get canteenTranslation() {
        return this.authService.getUserCanteenName();
    }

    get schoolTranslation() {
        return this.authService.getUserSchoolName();
    }

    get menuItemClass() {
        return AppComponent.textDir === 'rtl' ? 'font-dubai-regular' : 'font-dubai-medium';
    }

    get subMenuItemClass() {
        return AppComponent.textDir === 'rtl' ? 'font-dubai-regular mr-3' : 'font-dubai-medium ml-3';
    }

    constructor(private authService: AuthService, private navMenuService: NavMenuService) {
        super();

        this.isAdmin = this.authService.doesHaveRoles([UserRoles.WAKI_ADMIN, UserRoles.WAKI_SUPER_ADMIN]);

        this.navMenus = this.generateMenuItems();
    }

    generateMenuItems = (): MenuItem[] => {
        if (this.authService.isAdminOrSuperAdmin()) {
            return this.navMenuService.generateAdminMenu();
        }

        if (this.authService.isSuperSchoolUser() || this.authService.isSchoolUser()) {
            let menus: MenuItem[] = [];
            const schoolName = this.schoolTranslation;

            if (this.authService.isSuperSchoolUser()) {
                menus = this.navMenuService.generateSuperSchoolMenu();
            } else {
                menus = this.navMenuService.generateNormalSchoolMenu();
            }

            if (schoolName) {
                for (let menu of menus) {
                    if (menu.label === 'Schools') {
                        menu.label = schoolName;
                    }
                }
            }

            return menus;
        }

        if (this.authService.isSuperCanteenUser() || this.authService.isCanteenUser()) {
            let menus: MenuItem[] = [];
            let canteenName = this.canteenTranslation;

            if (this.authService.isSuperCanteenUser()) {
                menus = this.navMenuService.generateSuperCanteenMenu();
            } else {
                menus = this.navMenuService.generateNormalCanteenMenu();
            }

            if (canteenName) {
                for (let menu of menus) {
                    if (menu.label === 'Canteens') {
                        menu.label = canteenName;
                    }
                }
            }

            return menus;
        }

        return [];
    };
}

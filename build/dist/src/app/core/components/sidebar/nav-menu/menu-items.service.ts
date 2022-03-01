import { Injectable } from '@angular/core';
import { MenuItem } from '@portal/shared/models/menu-item.model';

@Injectable({
    providedIn: 'root'
})
export class NavMenuService {
    defaultMenu: MenuItem[] = [{ order: 0, link: '/home', label: 'Home', type: 'LINK' }];

    schoolMenu: MenuItem = {
        order: 10,
        link: '/schools',
        label: 'Schools',
        type: 'LINK',
        sub: [
            { order: 0, link: '/subscriptions', label: 'Subscriptions', type: 'ITEM' },
            { order: 10, link: '/students', label: 'Students', type: 'LINK' },
            { order: 20, link: '/classes', label: 'Classes', type: 'LINK' },
            // { order: 30, link: '/devices', label: 'Devices', type: 'LINK' },
            { order: 40, link: '/attendance', label: 'Attendance', type: 'LINK' },
            { order: 50, link: '/canteen-sales', label: 'Canteen Sales', type: 'LINK' }
        ]
    };

    businessSchoolMenu: MenuItem = {
        order: 1,
        link: '/schools',
        label: 'Schools',
        type: 'ITEM',
        sub: [
            { order: 10, link: '/students', label: 'Students', type: 'LINK' },
            { order: 20, link: '/classes', label: 'Classes', type: 'LINK' },
            // { order: 30, link: '/devices', label: 'Devices', type: 'LINK' },
            { order: 40, link: '/attendance', label: 'Attendance', type: 'LINK' },
            { order: 50, link: '/canteen-sales', label: 'Canteen Sales', type: 'LINK' }
        ]
    };

    canteenMenu: MenuItem = {
        order: 20,
        link: '/canteens',
        label: 'Canteens',
        type: 'LINK',
        sub: [
            { order: 0, link: '/subscriptions', label: 'Subscriptions', type: 'ITEM' },
            { order: 10, link: '/transactions', label: 'Transactions', type: 'LINK' },
            { order: 20, link: '/transfer-request', label: 'Transfer Requests', type: 'LINK' },
            { order: 30, link: '/fee', label: 'Fees', type: 'LINK' },
            { order: 40, link: '/food-orders', label: 'Food Orders', type: 'LINK' },
            { order: 50, link: '/canteen-menu', label: 'Food Menu', type: 'LINK' },
            { order: 60, link: '/food-items', label: 'Food Items', type: 'LINK' },
            { order: 70, link: '/coupons/order', label: 'Coupons Order', type: 'LINK' },
            { order: 80, link: '/coupons', label: 'Coupons', type: 'LINK' }
        ]
    };

    businessCanteenMenu: MenuItem = {
        order: 2,
        link: '/canteens',
        label: 'Canteens',
        type: 'ITEM',
        sub: [
            { order: 0, link: '/transactions', label: 'Transactions', type: 'LINK' },
            { order: 10, link: '/transfer-request', label: 'Transfer Requests', type: 'LINK' },
            { order: 20, link: '/fee', label: 'Fees', type: 'LINK' },
            { order: 30, link: '/food-orders', label: 'Food Orders', type: 'LINK' },
            { order: 40, link: '/canteen-menu', label: 'Food Menu', type: 'LINK' },
            { order: 50, link: '/food-items', label: 'Food Items', type: 'LINK' },
            { order: 60, link: '/coupons/order', label: 'Coupons Order', type: 'LINK' },
            { order: 70, link: '/coupons', label: 'Coupons', type: 'LINK' }
        ]
    };

    adultsMenu: MenuItem = {
        order: 30,
        link: '/adults',
        label: 'Adults',
        type: 'LINK',
        sub: [
            { order: 0, link: '/transactions', label: 'Transactions', type: 'LINK' },
            { order: 10, link: '/refund-requests', label: 'Refund Request', type: 'LINK' },
            { order: 20, link: '/card-store', label: 'Card Store', type: 'LINK' },
            { order: 30, link: '/card-orders', label: 'Card Orders', type: 'LINK' },
            { order: 40, link: '/card-designs', label: 'Card Designs', type: 'ITEM' }
        ]
    };

    dependantsMenu: MenuItem = {
        order: 40,
        link: '/dependants',
        label: 'Dependents',
        type: 'LINK',
        sub: [] // [{ order: 0, link: '/attendance-history', label: 'Attendance History', type: 'LINK' }]
    };

    businessUsersMenu: MenuItem = {
        order: 50,
        link: '/business-users',
        label: 'Business Users',
        type: 'LINK'
    };

    userMenu: MenuItem = { order: 60, link: '/users', label: 'Admins', type: 'LINK' };

    nonAdminUserMenu: MenuItem = { order: 60, link: '/users', label: 'Users', type: 'LINK' };

    logsMenu: MenuItem = { order: 70, link: '/logs', label: 'Logs', type: 'LINK' };

    generateAdminMenu = () => {
        return [
            ...this.defaultMenu,
            this.schoolMenu,
            this.canteenMenu,
            this.adultsMenu,
            this.dependantsMenu,
            this.businessUsersMenu,
            this.userMenu,
            this.logsMenu
        ];
    };

    generateSuperSchoolMenu = () => {
        return [...this.defaultMenu, this.businessSchoolMenu, this.nonAdminUserMenu];
    };

    generateNormalSchoolMenu = () => {
        return [...this.defaultMenu, this.businessSchoolMenu];
    };

    generateSuperCanteenMenu = () => {
        return [...this.defaultMenu, this.businessCanteenMenu, this.nonAdminUserMenu];
    };

    generateNormalCanteenMenu = () => {
        return [...this.defaultMenu, this.businessCanteenMenu];
    };
}

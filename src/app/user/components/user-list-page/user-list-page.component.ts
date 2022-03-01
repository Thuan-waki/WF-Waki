import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { defaultUserFilter, IUser, IUserFilter } from '@portal/shared/models/user.model';
import { UserService } from '@portal/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-user-list-page',
    templateUrl: './user-list-page.component.html',
    styleUrls: ['./user-list-page.component.scss']
})
export class UserListPageComponent extends ComponentBase {
    users: IUser[] = [];
    isLoading = true;
    recordCount = 0;
    maxPage = 0;
    pageSize = defaultUserFilter.limit || 50;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) {
        super();

        const isAllowed =
            this.authService.isAdminOrSuperAdmin() ||
            this.authService.isSuperSchoolUser() ||
            this.authService.isSuperCanteenUser();

        if (isAllowed) {
            this.getUsers(defaultUserFilter);
        } else {
            this.isLoading = false;
        }
    }

    getUsers = (filter: IUserFilter) => {
        this.isLoading = true;
        this.users = [];

        // if super admin
        this.userService
            .getUsers({ ...filter })
            .pipe(
                tap((result: HttpResponse<IApiResult>) => {
                    if (result.body?.success) {
                        this.users = result.body?.users || [];
                        this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
                        const numberOfPages = this.recordCount / this.pageSize;
                        this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
                    }

                    if (!result.body?.success) {
                        this.toastr.error('Failed to retrieve users', 'Users');
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((err: IApiFailure) => {
                    this.toastr.error('Failed to retrieve users', 'Users');
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe();
    };

    newUser = () => {
        this.router.navigate(['users/form']);
    };

    editUser = (userId: string) => {
        this.router.navigate([`users/form/${userId}`]);
    };
}

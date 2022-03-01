import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@portal/auth/services/auth.service';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { CanteenService } from '@portal/canteen/services/canteen.service';
import { ISchool } from '@portal/school/models/school.model';
import { SchoolService } from '@portal/school/services/school.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UserPermissions } from '@portal/shared/constants/user-permissions.constants';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { IUser } from '@portal/shared/models/user.model';
import { UserService } from '@portal/shared/services/user.service';
import { mustMatch } from '@portal/shared/validators/password-validators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-user-form-page',
    templateUrl: './user-form-page.component.html',
    styleUrls: ['./user-form-page.component.scss']
})
export class UserFormPageComponent extends ComponentBase implements OnInit {
    form: FormGroup | undefined;
    currentUserRoles: string[] = [];
    user: IUser | undefined;
    schools: ISchool[] = [];
    isLoading: boolean = true;
    isEditing: boolean = false;
    userFormMode: string = '';
    userRoleBeingEdited: string = '';
    userPermissionsBeingEdited: string[] = [];
    readonly: boolean = false;
    school: ISchool | undefined;
    canteen: ICanteen | undefined;
    isLookingForSchool: boolean = false;
    isLookingForCanteen: boolean = false;
    superCanteenUserPermissions = [UserPermissions.CAN_VIEW_CANTEEN, UserPermissions.CAN_EDIT_CANTEEN];
    superSchoolUserPermissions = [UserPermissions.CAN_VIEW_ATTENDANCE, UserPermissions.CAN_EDIT_ATTENDANCE];

    constructor(
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private userService: UserService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        super();
        this.currentUserRoles = this.authService.userRoles();
        this.prepareFormMode();
        const id = this.route.snapshot.params.id;

        if (id) {
            this.getUser(id);
            this.isEditing = true;
        } else {
            this.prepareForUserCreation();
            this.form = this.createForm();
            this.isEditing = false;
            this.isLoading = false;
        }
    }

    getUser = (userId: string) => {
        this.userService
            .getUser(userId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success && result.user) {
                        this.user = result.user;
                        if (this.user.roles?.includes(UserRoles.SUPER_SCHOOL_USER)) {
                            this.school = this.user?.schools[0] || undefined;
                        } else if (this.user.roles?.includes(UserRoles.SUPER_CANTEEN_USER)) {
                            this.canteen = this.user?.canteens[0] || undefined;
                        }
                        this.form = this.createForm(this.user);
                        this.prepareForUserEditing(this.user);
                    } else {
                        this.toastr.error('Failed to retrieve user', 'User');
                        this.goToUserList();
                    }

                    this.isLoading = false;
                }),
                takeUntil(this.destroyed$),
                catchError((error: IApiFailure) => {
                    this.toastr.error('Failed to retrieve user', 'User');
                    this.goToUserList();
                    return of();
                })
            )
            .subscribe();
    };

    createForm = (user?: IUser) => {
        if (this.isEditing) {
            const schoolOrCanteenId = user?.roles?.includes(UserRoles.SUPER_SCHOOL_USER)
                ? this.school?.schoolRegistrationCode
                : user?.roles?.includes(UserRoles.SUPER_CANTEEN_USER)
                ? this.canteen?.canteenId
                : '';
            return this.fb.group({
                translations: this.fb.group({
                    en: [user?.translations?.en || '', [Validators.required]],
                    ar: [user?.translations?.en || '', [Validators.required]]
                }),
                email: [user?.email || '', [Validators.required, Validators.email]],
                mobileNo: [user?.mobileNo || '', [Validators.required]],
                schoolOrCanteenId: [
                    schoolOrCanteenId,
                    this.userFormMode === UserRoles.WAKI_ADMIN ? [Validators.required] : []
                ]
            });
        }

        return this.fb.group(
            {
                translations: this.fb.group({
                    en: [user?.translations?.en || '', [Validators.required]],
                    ar: [user?.translations?.en || '', [Validators.required]]
                }),
                email: [user?.email || '', [Validators.required, Validators.email]],
                password: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]],
                mobileNo: [user?.mobileNo || '', [Validators.required]],
                schoolOrCanteenId: ['', this.userFormMode === UserRoles.WAKI_ADMIN ? [Validators.required] : []]
            },
            {
                validators: mustMatch('password', 'confirmPassword')
            }
        );
    };

    lookupSchool = (schoolId: string) => {
        this.isLookingForSchool = true;
        this.schoolService
            .lookupSchool(schoolId)
            .pipe(
                tap((result) => {
                    if (result.success && result.schools?.length) {
                        this.school = result.schools[0];
                    }

                    this.isLookingForSchool = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLookingForSchool = false;
                    return of();
                })
            )
            .subscribe();
    };

    lookupCanteen = (canteenId: string) => {
        this.isLookingForCanteen = true;

        this.canteenService
            .lookupCanteen(canteenId)
            .pipe(
                tap((result) => {
                    if (result.success) {
                        this.canteen = result.canteen;
                    }

                    this.isLookingForCanteen = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    return of();
                })
            )
            .subscribe();
    };

    map = (rolesAndPermission: any) => {
        const formValue = this.form?.getRawValue();

        if (!formValue) {
            return;
        }

        let user: any = {
            email: formValue.email,
            password: formValue.password,
            mobileNo: formValue.mobileNo,
            roles: rolesAndPermission.roles,
            permissions: rolesAndPermission.permissions,
            translations: formValue.translations
        };

        if (this.school?._id) {
            user.schools = [this.school?._id];
        } else if (this.canteen) {
            user.canteens = [this.canteen?._id];
        }

        return user;
    };

    save = (rolesAndPermission: any) => {
        if (!this.form?.valid) {
            return;
        }

        this.isLoading = true;

        const user = this.map(rolesAndPermission);

        const obs = this.isEditing ? this.patchUser(this.user!._id, user) : this.postUser(user);

        obs.pipe(
            tap((result) => {
                if (result.success) {
                    this.toastr.success('User save successful', 'Save User');
                    this.goToUserList();
                } else {
                    this.toastr.error('User save failed', 'Save User');
                }

                this.isLoading = false;
            }),
            takeUntil(this.destroyed$),
            catchError((error: IApiFailure) => {
                this.toastr.error('User save failed', 'Save User');
                this.isLoading = false;
                return of();
            })
        ).subscribe();
    };

    postUser = (user: any) => {
        return this.userService.postUser(user);
    };

    patchUser = (userId: string, user: any) => {
        return this.userService.patchUser(userId, user);
    };

    goToUserList = () => {
        this.router.navigate(['users']);
    };

    get shouldDisableSaveButton() {
        return (
            !this.form?.valid || this.isLoading || this.readonly || this.isLookingForSchool || this.isLookingForCanteen
        );
    }

    prepareFormMode = () => {
        if (this.currentUserRoles.includes(UserRoles.WAKI_SUPER_ADMIN)) {
            this.userFormMode = UserRoles.WAKI_SUPER_ADMIN;
            return;
        }

        if (this.currentUserRoles.includes(UserRoles.WAKI_ADMIN)) {
            this.userFormMode = UserRoles.WAKI_ADMIN;
            return;
        }

        if (this.currentUserRoles.includes(UserRoles.SUPER_CANTEEN_USER)) {
            this.userFormMode = UserRoles.SUPER_CANTEEN_USER;
            return;
        }

        if (this.currentUserRoles.includes(UserRoles.SUPER_SCHOOL_USER)) {
            this.userFormMode = UserRoles.SUPER_SCHOOL_USER;
            return;
        }

        this.toastr.error('Unauthorized access', 'User Form');
        this.goToUserList();
    };

    prepareForUserCreation = () => {
        if (this.userFormMode === UserRoles.WAKI_SUPER_ADMIN) {
            this.userRoleBeingEdited = UserRoles.WAKI_ADMIN;
            return;
        }

        if (this.userFormMode === UserRoles.WAKI_ADMIN) {
            this.userRoleBeingEdited = UserRoles.SUPER_SCHOOL_USER;
            this.userPermissionsBeingEdited = this.superSchoolUserPermissions;

            return;
        }

        if (this.userFormMode === UserRoles.SUPER_SCHOOL_USER) {
            this.userRoleBeingEdited = UserRoles.SCHOOL_USER;
            return;
        }

        if (this.currentUserRoles.includes(UserRoles.SUPER_CANTEEN_USER)) {
            this.userFormMode = UserRoles.SUPER_CANTEEN_USER;
            return;
        }

        this.toastr.error('Unauthorized access', 'User Form');
        this.goToUserList();
    };

    prepareForUserEditing = (user: IUser) => {
        const roles = user.roles;

        if (this.userFormMode === UserRoles.WAKI_SUPER_ADMIN) {
            if (roles.includes(UserRoles.WAKI_SUPER_ADMIN)) {
                this.userRoleBeingEdited = UserRoles.WAKI_SUPER_ADMIN;
                return;
            }

            if (roles.includes(UserRoles.WAKI_ADMIN)) {
                this.userRoleBeingEdited = UserRoles.WAKI_ADMIN;
                return;
            }

            if (roles.includes(UserRoles.SUPER_CANTEEN_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_CANTEEN_USER;
                this.userPermissionsBeingEdited = this.superCanteenUserPermissions;
                return;
            }

            if (roles.includes(UserRoles.SUPER_SCHOOL_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_SCHOOL_USER;
                this.userPermissionsBeingEdited = this.superSchoolUserPermissions;
                return;
            }

            this.userRoleBeingEdited = roles[0];
            this.readonly = true;
            return;
        }

        if (this.userFormMode === UserRoles.WAKI_ADMIN) {
            if (roles.includes(UserRoles.WAKI_ADMIN)) {
                this.userRoleBeingEdited = UserRoles.WAKI_ADMIN;
                return;
            }

            if (roles.includes(UserRoles.SUPER_CANTEEN_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_CANTEEN_USER;
                this.userPermissionsBeingEdited = this.superCanteenUserPermissions;
                return;
            }

            if (roles.includes(UserRoles.SUPER_SCHOOL_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_SCHOOL_USER;
                this.userPermissionsBeingEdited = this.superSchoolUserPermissions;
                return;
            }

            if (roles.includes(UserRoles.WAKI_SUPER_ADMIN)) {
                this.userRoleBeingEdited = roles[0];
                this.readonly = true;
                return;
            }
        }

        if (this.userFormMode === UserRoles.SUPER_CANTEEN_USER) {
            if (roles.includes(UserRoles.SUPER_CANTEEN_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_CANTEEN_USER;
                this.userPermissionsBeingEdited = this.superCanteenUserPermissions;
                return;
            }

            if (roles.includes(UserRoles.CANTEEN_USER)) {
                this.userRoleBeingEdited = UserRoles.CANTEEN_USER;
                this.userPermissionsBeingEdited = [...user?.permissions];
                return;
            }
        }

        if (this.userFormMode === UserRoles.SUPER_SCHOOL_USER) {
            if (roles.includes(UserRoles.SUPER_SCHOOL_USER)) {
                this.userRoleBeingEdited = UserRoles.SUPER_SCHOOL_USER;
                this.userPermissionsBeingEdited = this.superSchoolUserPermissions;
                return;
            }

            if (roles.includes(UserRoles.SCHOOL_USER)) {
                this.userRoleBeingEdited = UserRoles.SCHOOL_USER;
                this.userPermissionsBeingEdited = [...user?.permissions];
                return;
            }
        }

        this.toastr.error('Unauthorized access', 'User Form');
        this.goToUserList();
    };
}

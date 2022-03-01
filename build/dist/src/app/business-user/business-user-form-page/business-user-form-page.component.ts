import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { catchError, debounceTime, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-business-user-form-page',
    templateUrl: './business-user-form-page.component.html',
    styleUrls: ['./business-user-form-page.component.scss']
})
export class BusinessUserFormPageComponent extends ComponentBase {
    form: FormGroup | undefined;
    user: IUser | undefined;
    isAdminUser: boolean = false;
    schools: ISchool[] = [];
    isLoading: boolean = true;
    isEditing: boolean = false;
    userRoleBeingEdited: string = '';
    userPermissionsBeingEdited: string[] = [];
    school: ISchool | undefined;
    canteen: ICanteen | undefined;
    isLookingForSchool: boolean = false;
    isLookingForCanteen: boolean = false;
    superCanteenUserPermissions = [UserPermissions.CAN_VIEW_CANTEEN, UserPermissions.CAN_EDIT_CANTEEN];
    superSchoolUserPermissions = [UserPermissions.CAN_VIEW_ATTENDANCE, UserPermissions.CAN_EDIT_ATTENDANCE];
    currentUserType: 'school' | 'canteen' = 'school';
    canteenSchools: string[] = [];
    userRoles = UserRoles;
    userPermissions = UserPermissions;

    get schoolRegistrationCode() {
        return this.form?.get('schoolRegistrationCode') as FormControl;
    }
    get canteenRegistrationId() {
        return this.form?.get('canteenRegistrationId') as FormControl;
    }
    get schoolId() {
        return this.form?.get('schoolId') as FormControl;
    }
    get canteenId() {
        return this.form?.get('canteenId') as FormControl;
    }
    get userType() {
        return this.form?.get('userType') as FormControl;
    }
    get isSuperAdmin() {
        return this.form?.get('isSuperAdmin') as FormControl;
    }
    get isAdmin() {
        return this.form?.get('isAdmin') as FormControl;
    }
    get isSuperSchool() {
        return this.form?.get('isSuperSchool') as FormControl;
    }
    get isSchool() {
        return this.form?.get('isSchool') as FormControl;
    }
    get viewSchool() {
        return this.form?.get('viewSchool') as FormControl;
    }
    get editSchool() {
        return this.form?.get('editSchool') as FormControl;
    }
    get schoolAppUser() {
        return this.form?.get('schoolAppUser') as FormControl;
    }
    get isSuperCanteen() {
        return this.form?.get('isSuperCanteen') as FormControl;
    }
    get isCanteen() {
        return this.form?.get('isCanteen') as FormControl;
    }
    get viewCanteen() {
        return this.form?.get('viewCanteen') as FormControl;
    }
    get editCanteen() {
        return this.form?.get('editCanteen') as FormControl;
    }
    get canteenAppUser() {
        return this.form?.get('canteenAppUser') as FormControl;
    }

    constructor(
        private schoolService: SchoolService,
        private canteenService: CanteenService,
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {
        super();

        this.isAdminUser = this.authService.isAdminOrSuperAdmin();

        if (!this.isAdminUser) {
            this.toastr.error('Unauthorized');
            this.goToUserList();
        }

        const id = this.route.snapshot.params.id;

        if (id) {
            this.isEditing = true;
            this.getUser(id);
        } else {
            this.createForm();
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
                        this.createForm(this.user);
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
        this.form = this.fb.group(
            {
                translations: this.fb.group({
                    en: [user?.translations?.en || '', [Validators.required]],
                    ar: [user?.translations?.ar || '', [Validators.required]]
                }),
                email: [user?.email, [Validators.required]],
                mobileNo: [user?.mobileNo, [Validators.required]],
                password: [''],
                confirmPassword: [''],
                schoolRegistrationCode: [
                    user?.roles?.includes(UserRoles.SUPER_CANTEEN_USER) ||
                    user?.roles?.includes(this.userRoles.CANTEEN_USER)
                        ? ''
                        : user?.schools[0]?.schoolRegistrationCode || ''
                ],
                canteenRegistrationId: [user?.canteens[0]?.canteenId || ''],
                canteenId: ['', [Validators.required]],
                schoolId: ['', Validators.required],
                userType: ['school'],
                isSuperAdmin: [false],
                isAdmin: [false],
                isSuperSchool: [false],
                isSchool: [false],
                viewSchool: [false],
                editSchool: [false],
                schoolAppUser: [false],
                isSuperCanteen: [false],
                isCanteen: [false],
                viewCanteen: [false],
                editCanteen: [false],
                canteenAppUser: [false]
            },
            {
                validators: mustMatch('password', 'confirmPassword')
            }
        );

        if (!this.isEditing) {
            this.form.get('password')?.setValidators([Validators.required]);
            this.form.get('confirmPassword')?.setValidators([Validators.required]);
            this.form.updateValueAndValidity();
        }

        if (this.isEditing) {
            if (
                this.schoolRegistrationCode?.value?.length &&
                !this.user?.roles.includes(UserRoles.SUPER_CANTEEN_USER)
            ) {
                this.lookupSchool(this.schoolRegistrationCode.value);
            }

            if (this.canteenRegistrationId?.value?.length) {
                this.lookupCanteen(this.canteenRegistrationId?.value);
            }
        }

        this.toggleUserType('school');

        this.form
            .get('userType')
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
                this.toggleUserType(value);
            });

        this.form
            .get('schoolRegistrationCode')
            ?.valueChanges.pipe(
                tap(() => this.schoolId.setValue('')),
                debounceTime(300),
                takeUntil(this.destroyed$)
            )
            .subscribe((value) => {
                if (!value.length) {
                    this.school = undefined;
                    this.schoolId.setValue('');
                }

                if (!this.schoolRegistrationCode.disabled && value.length) {
                    this.lookupSchool(value);
                }
            });

        this.form
            .get('canteenRegistrationId')
            ?.valueChanges.pipe(
                tap(() => this.canteenId.setValue('')),
                debounceTime(300),
                takeUntil(this.destroyed$)
            )
            .subscribe((value) => {
                if (!value.length) {
                    this.canteen = undefined;
                    this.canteenId.setValue('');
                }

                if (
                    this.form?.get('userType')?.value === 'canteen' &&
                    !this.canteenRegistrationId.disabled &&
                    value.length
                ) {
                    this.canteenSchools = [];
                    this.lookupCanteen(value);
                }
            });

        this.isSuperSchool.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            this.toggleSuperSchoolUser(value);
        });

        this.schoolAppUser.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            this.toggleSchoolAppUser(value);
        });

        this.isSuperCanteen.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            this.toggleSuperCanteenUser(value);
        });

        this.canteenAppUser.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            this.toggleCanteenAppUser(value);
        });

        if (this.isEditing) {
            this.populateCurrentUserRoleAndPermissions(user);
        }
    };

    populateCurrentUserRoleAndPermissions = (user?: IUser) => {
        if (!user) {
            return;
        }

        if (user.permissions?.includes(UserPermissions.CAN_VIEW_ATTENDANCE)) {
            this.viewSchool?.setValue(true);
        }

        if (user.permissions?.includes(UserPermissions.CAN_EDIT_ATTENDANCE)) {
            this.editSchool?.setValue(true);
        }

        if (user.permissions?.includes(UserPermissions.USE_ATTENDANCE_APP)) {
            this.schoolAppUser?.setValue(true);
        }

        if (user.permissions?.includes(UserPermissions.CAN_VIEW_CANTEEN)) {
            this.viewCanteen?.setValue(true);
        }

        if (user.permissions?.includes(UserPermissions.CAN_EDIT_CANTEEN)) {
            this.editCanteen?.setValue(true);
        }

        if (user.permissions?.includes(UserPermissions.CAN_USE_CANTEEN_APP)) {
            this.canteenAppUser?.setValue(true);
        }

        if (user.roles?.includes(UserRoles.SUPER_SCHOOL_USER)) {
            this.isSuperSchool?.setValue(true);
        }

        if (user.roles?.includes(UserRoles.SUPER_CANTEEN_USER)) {
            this.isSuperCanteen?.setValue(true);
        }

        if (
            user.roles?.includes(UserRoles.SUPER_SCHOOL_USER) ||
            user.roles?.includes(UserRoles.SCHOOL_USER) ||
            user.roles?.includes(UserRoles.ATTENDANCE_APP_USER)
        ) {
            if (this.userType.value !== 'school') {
                this.userType.setValue('school');
            }
        } else {
            if (this.userType.value !== 'canteen') {
                this.userType.setValue('canteen');
            }
        }
    };

    goToUserList = () => {
        this.router.navigateByUrl('business-users');
    };

    toggleSuperSchoolUser = (value: boolean) => {
        if (value) {
            this.viewSchool.setValue(true);
            this.editSchool.setValue(true);
            if (this.schoolAppUser.value) {
                this.schoolAppUser.setValue(false);
            }
            this.viewSchool.disable();
            this.editSchool.disable();
        } else if (this.userType.value === 'school') {
            this.viewSchool.enable();
            this.editSchool.enable();
        }

        this.form?.updateValueAndValidity();
    };

    toggleSchoolAppUser = (value: boolean) => {
        if (value) {
            this.viewSchool.setValue(false);
            this.editSchool.setValue(false);
            if (this.isSuperSchool.value) {
                this.isSuperSchool.setValue(false);
            }
            this.viewSchool.disable();
            this.editSchool.disable();
        } else if (this.userType.value === 'school') {
            this.viewSchool.enable();
            this.editSchool.enable();
        }

        this.form?.updateValueAndValidity();
    };

    toggleSuperCanteenUser = (value: boolean) => {
        if (value) {
            this.viewCanteen.setValue(true);
            this.editCanteen.setValue(true);
            if (this.canteenAppUser.value) {
                this.canteenAppUser.setValue(false);
            }
            this.viewCanteen.disable();
            this.editCanteen.disable();
            this.schoolRegistrationCode.disable();
            this.schoolId.disable();
        } else if (this.userType.value === 'canteen') {
            this.schoolRegistrationCode.enable();
            this.schoolId.enable();
            this.viewCanteen.enable();
            this.editCanteen.enable();
        } else {
            this.schoolRegistrationCode.enable();
            this.schoolId.enable();
        }

        this.form?.updateValueAndValidity();
    };

    toggleCanteenAppUser = (value: boolean) => {
        if (value) {
            this.viewCanteen.setValue(false);
            this.editCanteen.setValue(false);
            if (this.isSuperCanteen.value) {
                this.isSuperCanteen.setValue(false);
            }
            this.viewCanteen.disable();
            this.editCanteen.disable();
            this.schoolRegistrationCode.enable();
            this.schoolId.enable();
        } else if (this.userType.value === 'canteen') {
            this.viewCanteen.enable();
            this.editCanteen.enable();
            this.schoolRegistrationCode.disable();
            this.schoolId.disable();
        }

        this.form?.updateValueAndValidity();
    };

    toggleUserType = (userType: 'school' | 'canteen') => {
        if (userType === 'school') {
            this.disableCanteenRole();
        } else if (userType === 'canteen') {
            this.disableSchoolRole();
        }
    };

    disableSchoolRole = () => {
        this.viewSchool.setValue(false);
        this.editSchool.setValue(false);
        this.schoolAppUser.setValue(false);
        this.isSuperSchool.setValue(false);
        this.viewSchool.disable();
        this.editSchool.disable();
        this.schoolAppUser.disable();
        this.isSuperSchool.disable();
        this.viewCanteen.enable();
        this.editCanteen.enable();
        this.canteenAppUser.enable();
        this.isSuperCanteen.enable();
        this.canteenId.enable();
        this.schoolRegistrationCode.disable();
        this.schoolId.disable();
        this.form?.updateValueAndValidity();
    };

    disableCanteenRole = () => {
        this.viewSchool.enable();
        this.editSchool.enable();
        this.schoolAppUser.enable();
        this.isSuperSchool.enable();
        this.viewCanteen.setValue(false);
        this.editCanteen.setValue(false);
        this.canteenAppUser.setValue(false);
        this.isSuperCanteen.setValue(false);
        this.viewCanteen.disable();
        this.editCanteen.disable();
        this.canteenAppUser.disable();
        this.isSuperCanteen.disable();
        this.canteenId.disable();
        this.form?.updateValueAndValidity();
    };

    lookupSchool = (schoolId: string) => {
        this.isLookingForSchool = true;
        this.schoolService
            .lookupSchool(schoolId)
            .pipe(
                tap((result) => {
                    if (result.success && result.schools?.length) {
                        this.school = result.schools[0];
                        this.schoolId.setValue(this.school._id);
                        this.form?.updateValueAndValidity();
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
                        this.canteenId.setValue(this.canteen?._id);
                        this.form?.updateValueAndValidity();
                        this.getSelectSchools(this.canteen?._id || '');
                    }

                    this.isLookingForCanteen = false;
                }),
                takeUntil(this.destroyed$),
                catchError(() => {
                    this.isLookingForCanteen = false;
                    return of();
                })
            )
            .subscribe();
    };

    getSelectSchools = (canteenId: string) => {
        if (!this.canteenId) {
            return;
        }
        this.schoolService
            .getSelectSchools(['id'], canteenId)
            .pipe(
                tap((result: IApiResult) => {
                    if (result.success) {
                        this.canteenSchools = (result.schools || []).map((s) => s._id);
                    }
                }),
                takeUntil(this.destroyed$),
                catchError(() => of())
            )
            .subscribe();
    };

    map = () => {
        const formValue = this.form?.getRawValue();

        if (!formValue) {
            return;
        }

        const user: any = {
            email: formValue.email,
            mobileNo: formValue.mobileNo,
            translations: formValue.translations,
            roles: [],
            permissions: []
        };

        if (!this.isEditing) {
            user.password = formValue.password;
        }

        if (formValue.userType === 'school') {
            user.schools = [formValue.schoolId];

            if (formValue.isSuperSchool) {
                user.roles.push(UserRoles.SUPER_SCHOOL_USER);
            } else if (formValue.schoolAppUser) {
                user.roles.push(UserRoles.ATTENDANCE_APP_USER);
                user.permissions.push(UserPermissions.USE_ATTENDANCE_APP);
            } else {
                user.roles.push(UserRoles.SCHOOL_USER);
            }
        } else {
            user.canteens = [formValue.canteenId];
            if (formValue.isSuperCanteen) {
                user.roles.push(UserRoles.SUPER_CANTEEN_USER);
                user.schools = this.canteenSchools;
            } else if (formValue.canteenAppUser) {
                user.roles.push(UserRoles.CANTEEN_APP_USER);
                user.permissions.push(UserPermissions.CAN_USE_CANTEEN_APP);
                user.schools = [formValue.schoolId];
            } else {
                user.roles.push(UserRoles.CANTEEN_USER);
                user.schools = [formValue.schoolId];
            }
        }

        if (this.viewSchool.value) {
            user.permissions.push(UserPermissions.CAN_VIEW_ATTENDANCE);
        }

        if (this.editSchool.value) {
            user.permissions.push(UserPermissions.CAN_EDIT_ATTENDANCE);
        }

        if (this.viewCanteen.value) {
            user.permissions.push(UserPermissions.CAN_VIEW_CANTEEN);
        }

        if (this.editCanteen.value) {
            user.permissions.push(UserPermissions.CAN_EDIT_CANTEEN);
        }

        return user;
    };

    save = () => {
        if (!this.form?.valid) {
            return;
        }

        const user = this.map();

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

    get shouldDisableSaveButton() {
        return !this.form?.valid || this.isLoading;
    }
}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ISchool } from '@portal/school/models/school.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UserPermissions } from '@portal/shared/constants/user-permissions.constants';
import { UserRoles } from '@portal/shared/constants/user-roles.constants';
import { IUser } from '@portal/shared/models/user.model';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends ComponentBase implements OnChanges {
    @Input() form: FormGroup | undefined;
    @Input() user: IUser | undefined;
    @Input() isEditing: boolean = false;
    @Input() isLoading: boolean = true;
    @Input() schools: ISchool[] = [];
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() readonly: boolean = false;
    @Input() userFormMode: string = '';
    @Input() userRoleBeingEdited: string = '';
    @Input() userPermissionsBeingEdited: string[] = [];
    @Input() school: ISchool | undefined;
    @Input() canteen: ICanteen | undefined;
    @Input() isLookingForSchool: boolean = false;
    @Input() isLookingForCanteen: boolean = false;
    @Output() save = new EventEmitter<any>();
    @Output() exit = new EventEmitter();
    @Output() lookupSchool = new EventEmitter<string>();
    @Output() lookupCanteen = new EventEmitter<string>();

    userRoles = UserRoles;
    userPermissions = UserPermissions;
    selectedUserRoles: string[] = [];
    selectedPermissions: string[] = [];
    schoolOptions: any = [];
    superUserPermissions = [
        UserPermissions.CAN_EDIT_CANTEEN,
        UserPermissions.CAN_VIEW_CANTEEN,
        UserPermissions.CAN_EDIT_ATTENDANCE,
        UserPermissions.CAN_VIEW_ATTENDANCE
    ];

    isSchoolSuperUserChecked = false;
    isCanteenSuperUserChecked = false;

    constructor() {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.userRoleBeingEdited) {
            this.selectedUserRoles = [this.userRoleBeingEdited];

            this.onSchoolOrCanteenSuperUserRadioChange(this.userRoleBeingEdited);
        }

        if (changes.userPermissionsBeingEdited) {
            this.selectedPermissions = [...this.userPermissionsBeingEdited];
        }

        if (changes.form) {
            if (this.form && this.userFormMode === UserRoles.WAKI_ADMIN) {
                this.form
                    ?.get('schoolOrCanteenId')
                    ?.valueChanges.pipe(debounceTime(300), takeUntil(this.destroyed$))
                    .subscribe((value) => {
                        if (!value.length) {
                            this.canteen = undefined;
                            this.school = undefined;
                            return;
                        }

                        if (this.isSchoolSuperUserChecked) {
                            this.lookupSchool.emit(value);
                        } else if (this.isCanteenSuperUserChecked) {
                            this.lookupCanteen.emit(value);
                        }
                    });
            }
        }
    }

    populateUserPermission = () => {
        this.selectedPermissions = [...(this.user?.permissions || [])];
    };

    populateUserRole = () => {
        this.selectedUserRoles = [...(this.user?.roles || [])];
    };

    onSuperUserCheckboxClick = (event: any) => {
        if (event.target.checked && !this.selectedUserRoles.includes(UserRoles.WAKI_SUPER_ADMIN)) {
            this.selectedUserRoles = [UserRoles.WAKI_SUPER_ADMIN];
            this.selectedPermissions = [];
            return;
        }

        this.selectedUserRoles = [UserRoles.WAKI_ADMIN];
        this.selectedPermissions = [];
    };

    onPermissionCheckToggle = (checked: any, permission: string) => {
        if (checked && !this.selectedPermissions.includes(permission)) {
            this.selectedPermissions.push(permission);
        } else {
            this.selectedPermissions = [...this.selectedPermissions.filter((perm) => perm !== permission)];
        }
    };

    hasPermission = (permission: string): boolean => {
        return this.selectedPermissions.includes(permission);
    };

    shouldDisableCheckbox = (permission: string): boolean => {
        if (
            permission === UserPermissions.CAN_VIEW_ATTENDANCE ||
            permission === UserPermissions.CAN_EDIT_ATTENDANCE ||
            permission === UserRoles.ATTENDANCE_APP_USER
        ) {
            return (
                this.selectedUserRoles.includes(UserRoles.SUPER_SCHOOL_USER) ||
                this.selectedUserRoles.includes(UserRoles.WAKI_SUPER_ADMIN)
            );
        }

        if (
            permission === UserPermissions.CAN_VIEW_CANTEEN ||
            permission === UserPermissions.CAN_EDIT_CANTEEN ||
            permission === UserRoles.CANTEEN_APP_USER
        ) {
            return (
                this.selectedUserRoles.includes(UserRoles.SUPER_CANTEEN_USER) ||
                this.selectedUserRoles.includes(UserRoles.WAKI_SUPER_ADMIN)
            );
        }

        return false;
    };

    onSaveClick = () => {
        if (this.userFormMode === UserRoles.WAKI_SUPER_ADMIN && !this.selectedUserRoles.length) {
            this.selectedUserRoles.push(UserRoles.WAKI_ADMIN);
        }

        this.save.emit({
            permissions: this.selectedPermissions,
            roles: this.selectedUserRoles
        });
    };

    onSchoolOrCanteenSuperUserRadioChange = (userRole: any) => {
        this.isSchoolSuperUserChecked = userRole === UserRoles.SUPER_SCHOOL_USER;
        this.isCanteenSuperUserChecked = userRole === UserRoles.SUPER_CANTEEN_USER;

        if (this.isCanteenSuperUserChecked) {
            this.selectedUserRoles = [UserRoles.SUPER_CANTEEN_USER];
        } else if (this.isSchoolSuperUserChecked) {
            this.selectedUserRoles = [UserRoles.SUPER_SCHOOL_USER];
            this.selectedPermissions = [UserPermissions.CAN_VIEW_ATTENDANCE, UserPermissions.CAN_EDIT_ATTENDANCE];
        }
    };
}

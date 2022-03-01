export class UserPermissions {
    public static readonly CAN_VIEW_ATTENDANCE = 'CAN_VIEW_ATTENDANCE';
    public static readonly CAN_EDIT_ATTENDANCE = 'CAN_EDIT_ATTENDANCE';
    public static readonly CAN_VIEW_CANTEEN = 'CAN_VIEW_CANTEEN';
    public static readonly CAN_EDIT_CANTEEN = 'CAN_EDIT_CANTEEN';
    public static readonly FULL_ACCESS_EXCEPT_REMOVE = 'FULL_ACCESS_EXCEPT_REMOVE';
    public static readonly FULL_ACCESS = 'FULL_ACCESS';
    public static readonly USE_ATTENDANCE_APP = 'USE_ATTENDANCE_APP';
    public static readonly CAN_USE_CANTEEN_APP = 'CAN_USE_CANTEEN_APP';
}

export const userPermissionsOptions = () => {
    return [
        {
            label: 'View Attendance',
            value: UserPermissions.CAN_VIEW_ATTENDANCE
        },
        {
            label: 'Edit Attendance',
            value: UserPermissions.CAN_EDIT_ATTENDANCE
        },
        {
            label: 'View Canteen',
            value: UserPermissions.CAN_VIEW_CANTEEN
        },
        {
            label: 'Edit Canteen',
            value: UserPermissions.CAN_EDIT_CANTEEN
        },
        {
            label: 'Full Access Except Remove',
            value: UserPermissions.FULL_ACCESS_EXCEPT_REMOVE
        },
        {
            label: 'Full Access',
            value: UserPermissions.FULL_ACCESS
        }
    ];
};

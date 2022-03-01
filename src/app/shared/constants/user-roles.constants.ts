export class UserRoles {
    public static readonly WAKI_ADMIN = 'WAKI_ADMIN';
    public static readonly WAKI_SUPER_ADMIN = 'WAKI_SUPER_ADMIN';
    public static readonly SCHOOL_USER = 'SCHOOL_USER';
    public static readonly SUPER_SCHOOL_USER = 'SUPER_SCHOOL_USER';
    public static readonly CANTEEN_USER = 'CANTEEN_USER';
    public static readonly SUPER_CANTEEN_USER = 'SUPER_CANTEEN_USER';
    public static readonly PARENT = 'PARENT';
    public static readonly ATTENDANCE_APP_USER = 'ATTENDANCE_APP_USER';
    public static readonly CANTEEN_APP_USER = 'CANTEEN_APP_USER';
}

export const userRolesOptions = () => {
    return [
        {
            label: 'WAKI Admin',
            value: UserRoles.WAKI_ADMIN
        },
        {
            label: 'WAKI Super Admin',
            value: UserRoles.WAKI_SUPER_ADMIN
        },
        {
            label: 'Super School User',
            value: UserRoles.SUPER_SCHOOL_USER
        },
        {
            label: 'School User',
            value: UserRoles.SCHOOL_USER
        },
        {
            label: 'Super Canteen User',
            value: UserRoles.SUPER_CANTEEN_USER
        },
        {
            label: 'Canteen User',
            value: UserRoles.CANTEEN_USER
        },
        {
            label: 'Parent',
            value: UserRoles.PARENT
        },
        {
            label: 'Attendance App User',
            value: UserRoles.ATTENDANCE_APP_USER
        },
        {
            label: 'Canteen App User',
            value: UserRoles.CANTEEN_APP_USER
        }
    ];
};

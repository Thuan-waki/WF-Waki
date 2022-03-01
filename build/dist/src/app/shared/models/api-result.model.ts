import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { ICanteenMenu } from '@portal/canteen/models/canteen-menu.model';
import { ITransaction } from '@portal/canteen/models/transaction.model';
import { IUser } from './user.model';
import { IFoodOrder } from '@portal/canteen/models/food-order.model';
import { ICardOrder } from '@portal/adults/models/card-order.model';
import { IRequest } from './request.model';
import { ISchool } from '@portal/school/models/school.model';
import { ICountry } from './country.model';
import { ICity } from './city.model';
import { IStudent } from '@portal/school/models/student.model';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ICoupon } from '@portal/canteen/models/coupon.model';
import { IBank } from './bank.model';
import { IParent } from '@portal/adults/models/parent.model';
import { IGrade } from '@portal/school/models/grade.model';
import { ICouponOrder } from '@portal/canteen/models/coupon-order.model';
import { IDevice } from '@portal/school/models/device.model';
import { IAttendance } from '@portal/school/models/attendance.model';
import { ISchoolRegulation } from '@portal/school/models/school-regulation.model';
import { IFee } from '@portal/fee/models/fee.model';
import { IStoreItem } from '@portal/adults/models/card-store.model';

export interface IApiResult {
    success: boolean;
    msg: string;
    profile?: IUser;
    transactions?: ITransaction[];
    schools?: ISchool[];
    school?: ISchool;
    students?: IStudent[];
    student?: IStudent;
    foodItems?: IFoodItem[];
    foodItem?: IFoodItem;
    canteenMenus?: ICanteenMenu[];
    canteenMenu?: ICanteenMenu;
    foodOrders?: IFoodOrder[];
    requests?: IRequest[];
    cardOrders?: ICardOrder[];
    countries?: ICountry[];
    cities?: ICity[];
    users?: IUser[];
    user?: IUser;
    parents?: IParent[];
    parent?: IParent;
    canteens?: ICanteen[];
    canteen?: ICanteen;
    coupons?: ICoupon[];
    coupon?: ICoupon;
    couponOrders?: ICouponOrder[];
    banks?: IBank[];
    grade?: IGrade;
    grades?: IGrade[];
    physicalDevices?: IDevice[];
    attendance?: IAttendance[];
    regulations?: ISchoolRegulation;
    fees?: IFee[];
    storeItems?: IStoreItem[];
    storeItem?: IStoreItem;
}

export interface IApiFailure extends IApiResult {
    errorCode: string;
    error?: any;
}

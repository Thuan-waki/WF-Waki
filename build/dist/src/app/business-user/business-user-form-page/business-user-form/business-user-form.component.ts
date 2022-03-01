import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ISchool } from '@portal/school/models/school.model';
import { IUser } from '@portal/shared/models/user.model';

@Component({
    selector: 'app-business-user-form',
    templateUrl: './business-user-form.component.html',
    styleUrls: ['./business-user-form.component.scss']
})
export class BusinessUserFormComponent {
    @Input() form: FormGroup | undefined;
    @Input() user: IUser | undefined;
    @Input() isEditing: boolean = false;
    @Input() isLoading: boolean = true;
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() school: ISchool | undefined;
    @Input() canteen: ICanteen | undefined;
    @Input() isLookingForSchool: boolean = false;
    @Input() isLookingForCanteen: boolean = false;
    @Output() save = new EventEmitter<any>();
    @Output() exit = new EventEmitter();
    @Output() lookupSchool = new EventEmitter<string>();
    @Output() lookupCanteen = new EventEmitter<string>();

    constructor() {}
}

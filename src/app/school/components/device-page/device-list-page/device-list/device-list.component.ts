import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDevice } from '@portal/school/models/device.model';
import { ISelectOption } from '@portal/shared/models/select-option.model';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnChanges {
    @Input() isAdmin = false;
    @Input() devices: IDevice[] = [];
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() isLoading = true;
    @Output() getDevices = new EventEmitter<string>();
    @Output() export = new EventEmitter<string>();

    form: FormGroup = this.fb.group({
        school: [null]
    });

    get school() {
        return this.form.get('school') as FormControl;
    }

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.schoolOptions) {
            this.school.setValue(this.schoolOptions[0]?.value || '');
        }
    }

    onSchoolSelectChanged = () => {
        this.getDevices.emit(this.school.value);
    };

    onExportClick = () => {
        const schoolName = this.schoolOptions.find((school) => school.value === this.school.value)?.label || '';
        this.export.emit(schoolName);
    };
}

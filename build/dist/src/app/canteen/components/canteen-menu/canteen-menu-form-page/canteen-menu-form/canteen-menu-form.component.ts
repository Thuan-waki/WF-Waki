import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICanteenMenu } from '@portal/canteen/models/canteen-menu.model';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { ISchool } from '@portal/school/models/school.model';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ISelectOption } from '@portal/shared/models/select-option.model';
import { CanteenMenuFoodItemPickDialogComponent } from '../canteen-menu-food-item-pick-dialog/canteen-menu-food-item-pick-dialog.component';

@Component({
    selector: 'app-canteen-menu-form',
    templateUrl: './canteen-menu-form.component.html',
    styleUrls: ['./canteen-menu-form.component.scss']
})
export class CanteenMenuFormComponent implements OnChanges {
    @Input() canteenMenu: ICanteenMenu | undefined;
    @Input() isLoading: boolean = true;
    @Input() editMode = false;
    @Input() foodItemRecordCount = 0;
    @Input() canteenId = '';
    @Input() schoolOptions: ISelectOption[] = [];
    @Input() errorMessage: string = '';
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();

    get schools() {
        return this.form.get('schools') as FormControl;
    }
    form!: FormGroup;
    selectedFoodItems: IFoodItem[] = [];

    selectedSchools: string[] = [];
    dropdownSettings = {
        singleSelection: false,
        idField: 'value',
        textField: 'label',
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        allowSearchFilter: true
    };

    constructor(private fb: FormBuilder, public modalService: NgbModal) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.canteenMenu) {
            this.createFormGroup();
        }

        if (changes.schoolOptions || changes.canteenMenu) {
            this.populateSelectedSchools();
        }
    }

    createFormGroup = () => {
        this.form = this.fb.group({
            translations: this.fb.group({
                ar: [this.canteenMenu?.translations?.ar || '', [Validators.required]],
                en: [this.canteenMenu?.translations?.en || '', [Validators.required]]
            }),
            isPublishedForAdultApp: [this.canteenMenu?.isPublishedForAdultApp || false, [Validators.required]],
            isPublishedForBusinessApp: [this.canteenMenu?.isPublishedForBusinessApp || false, [Validators.required]],
            schools: [[]]
        });

        if (this.canteenMenu && this.canteenMenu?.foodItems?.length) {
            this.selectedFoodItems = this.canteenMenu.foodItems;
        }
    };

    populateSelectedSchools = () => {
        if (!this.canteenMenu?.schools?.length || !this.schoolOptions.length) {
            return;
        }

        this.schools.setValue(
            this.canteenMenu.schools.map((school) => {
                return {
                    value: (school as ISchool)?._id,
                    label: translationLang((school as ISchool)?.translations)
                };
            })
        );
    };

    map = () => {
        const formValue = this.form.getRawValue();

        let canteenMenu: any = {
            isPublished: formValue.isPublished,
            isPublishedForAdultApp: formValue.isPublishedForAdultApp,
            isPublishedForBusinessApp: formValue.isPublishedForBusinessApp,
            translations: {
                en: formValue.translations?.en,
                ar: formValue.translations?.ar
            },
            schools: formValue.schools.map((school: any) => school.value)
        };

        if (this.selectedFoodItems.length) {
            canteenMenu = {
                ...canteenMenu,
                foodItems: this.selectedFoodItems
            };
        }

        if (!this.editMode) {
            canteenMenu = {
                ...canteenMenu,
                name: formValue.translations.en
            };
        }

        return canteenMenu;
    };

    saveChanges = () => {
        if (!this.form.valid) {
            return;
        }

        const canteenMenu = this.map();

        this.save.emit(canteenMenu);
    };

    selectFoodItem = () => {
        const modalRef = this.modalService.open(CanteenMenuFoodItemPickDialogComponent, {
            size: 'md',
            backdrop: 'static'
        });

        modalRef.componentInstance.selectedFoodItems = this.selectedFoodItems;
        modalRef.componentInstance.canteenId = this.canteenId;
        modalRef.result
            .then((res) => {
                this.selectedFoodItems = [...res];
            })
            .catch();
    };

    removeSelectedFood = (foodItem: IFoodItem) => {
        this.selectedFoodItems = [...this.selectedFoodItems.filter((item) => item._id !== foodItem._id)];
    };

    get shouldDisableSaveButton() {
        return this.isLoading || !this.form.valid || this.selectedFoodItems.length < 1;
    }
}

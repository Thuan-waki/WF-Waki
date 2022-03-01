import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    IFoodItem,
    IFoodItemCustomization,
    IFoodItemCustomizationOption
} from '@portal/canteen/models/food-item.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { UPLOAD_FILE_SIZE_LIMIT_IN_BYTE } from '@portal/shared/constants/common.constants';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-food-item-form',
    templateUrl: './food-item-form.component.html',
    styleUrls: ['./food-item-form.component.scss']
})
export class FoodItemFormComponent extends ComponentBase implements OnChanges {
    @Input() foodItem: IFoodItem | undefined;
    @Input() isEditing: boolean = false;
    @Input() isLoading: boolean = true;
    @Output() save = new EventEmitter<IFoodItem>();
    @Output() exit = new EventEmitter();
    @Output() currentImage = new EventEmitter<string | ArrayBuffer | null>();

    form: FormGroup | undefined;
    image: string | ArrayBuffer | null = null;
    imageChangeEvent: any;
    originalImage: any;
    b64Image: any;
    imageServerUrl = getImageServerUrl();

    get customizations() {
        return this.form?.get('customizations') as FormArray;
    }

    customization = (i: number) => this.customizations.controls[i] as FormGroup;
    customizationOptions = (i: number) => this.customization(i).get('options') as FormArray;
    customizationOption = (customizationIndex: number, optionIndex: number) =>
        this.customizationOptions(customizationIndex).controls[optionIndex] as FormGroup;

    constructor(private fb: FormBuilder, private toastr: ToastrService, private cd: ChangeDetectorRef) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.foodItem) {
            this.generateForm();
        }
    }
    generateForm = () => {
        this.form = this.fb.group({
            _id: this.foodItem?._id,
            calories: [this.foodItem?.calories, [Validators.required]],
            availableQuantity: [this.foodItem?.availableQuantity, [Validators.required]],
            maxQuantityForOrder: [this.foodItem?.maxQuantityForOrder, [Validators.required]],
            pricePerItem: [this.foodItem?.pricePerItem, [Validators.required, Validators.min(0.0001)]],
            translations: this.fb.group({
                en: [this.foodItem?.translations.en, [Validators.required]],
                ar: [this.foodItem?.translations.ar, [Validators.required]]
            }),
            description: this.fb.group({
                en: [this.foodItem?.description?.en],
                ar: [this.foodItem?.description?.ar]
            }),
            customizations: this.fb.array([])
        });

        if (this.foodItem?.customizations?.length) {
            this.foodItem.customizations.forEach((customization) => {
                this.addCustomizationForm(customization);
            });
        }

        this.form.valueChanges
            .pipe(
                tap(() => this.cd.detectChanges()),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    };

    map = (): IFoodItem => {
        const formValue = this.form?.getRawValue();

        let foodItem: any = {
            calories: formValue.calories,
            availableQuantity: formValue.availableQuantity,
            maxQuantityForOrder: formValue.maxQuantityForOrder,
            pricePerItem: formValue.pricePerItem,
            translations: {
                en: formValue.translations.en,
                ar: formValue.translations.ar
            },
            description: formValue.description,
            customizations: []
        };

        if (formValue.customizations.length) {
            formValue.customizations.forEach((c: any) => {
                const foodItemCustomization: IFoodItemCustomization = {
                    name: c.translations.en,
                    customizationType: c.customizationType,
                    translations: {
                        en: c.translations.en,
                        ar: c.translations.ar
                    },
                    options: []
                };

                if (c.options.length) {
                    c.options.forEach((o: any) => {
                        const option: IFoodItemCustomizationOption = {
                            name: c.translations.en,
                            extraPrice: o.hasExtraPrice ? o.extraPrice : 0,
                            hasExtraPrice: o.hasExtraPrice,
                            translations: {
                                en: o.translations.en,
                                ar: o.translations.ar
                            }
                        };

                        foodItemCustomization.options.push(option);
                    });
                }

                foodItem.customizations.push(foodItemCustomization);
            });
        }

        return foodItem;
    };

    addCustomizationForm = (customization?: IFoodItemCustomization) => {
        const custmizationForm = this.fb.group({
            translations: this.fb.group({
                en: [customization?.translations?.en || '', [Validators.required]],
                ar: [customization?.translations?.ar || '', [Validators.required]]
            }),
            customizationType: [customization?.customizationType || 'SINGLE_CHOICE', [Validators.required]],
            options: this.fb.array([])
        });

        if (customization && customization.options && customization.options.length) {
            customization.options.forEach((option) =>
                (custmizationForm.get('options') as FormArray).push(this.createCustomizationOption(option))
            );
        }

        this.customizations.push(custmizationForm);
    };

    removeCustomization = (customizationIndex: number) => {
        this.customizations.removeAt(customizationIndex);
    };

    addCustomizationOption = (customizationIndex: number) => {
        this.customizationOptions(customizationIndex).push(this.createCustomizationOption());
    };

    createCustomizationOption = (customizationOption?: IFoodItemCustomizationOption) => {
        return this.fb.group({
            translations: this.fb.group({
                en: [customizationOption?.translations.en || '', [Validators.required]],
                ar: [customizationOption?.translations.ar || '', [Validators.required]]
            }),
            hasExtraPrice: [customizationOption?.hasExtraPrice || false, [Validators.required]],
            extraPrice: [{ value: customizationOption?.extraPrice || 0, disabled: !customizationOption?.hasExtraPrice }]
        });
    };

    removeCustomizationOption = (event: any) => {
        this.customizationOptions(event.customizationIndex).removeAt(event.optionIndex);
    };

    saveChanges = () => {
        if (!this.form?.valid) {
            return;
        }

        const foodItem = this.map();

        this.save.emit(foodItem);
    };

    onImagePicked = (event: any) => {
        if (event.target?.files?.length > 0) {
            if (!this.fileSizeAllowed(event.target?.files[0])) {
                this.toastr.error('File size must be lower than 4 MB', 'File Size Limit');
                return;
            }

            this.imageChangeEvent = event;
            this.originalImage = event.target?.files[0];

            if (this.originalImage) {
                var reader = new FileReader();

                reader.readAsDataURL(this.originalImage);
                reader.onload = () => {
                    this.image = reader.result;
                    this.b64Image = this.image?.toString().replace('data:', '').replace(/^.+,/, '');
                    this.currentImage.emit(this.b64Image);
                    this.cd.detectChanges();
                };
            }
        }
    };

    fileSizeAllowed = (file: any) => {
        return file && file.size < UPLOAD_FILE_SIZE_LIMIT_IN_BYTE;
    };

    get shouldDisableSaveButton() {
        return !this.form?.valid || this.isLoading;
    }
}

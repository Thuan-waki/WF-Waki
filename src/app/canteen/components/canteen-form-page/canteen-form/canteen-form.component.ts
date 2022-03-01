import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ICity } from '@portal/shared/models/city.model';
import { ICountry } from '@portal/shared/models/country.model';

@Component({
    selector: 'app-canteen-form',
    templateUrl: './canteen-form.component.html',
    styleUrls: ['./canteen-form.component.scss']
})
export class CanteenFormComponent implements OnChanges {
    @Input() form: FormGroup | undefined;
    @Input() canteen: ICanteen | undefined;
    @Input() bankOptions: any = [];
    @Input() isLoading: boolean = true;
    @Input() isEditing: boolean = false;
    @Input() shouldDisableSaveButton: boolean = true;
    @Input() countries: ICountry[] = [];
    @Input() cities: ICity[] = [];
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();

    countryOptions: any = [];
    cityOptions: any = [];

    get translations() {
        return this.form?.get('translations') as FormGroup;
    }

    get bankAccount() {
        return this.form?.get('bankAccount') as FormGroup;
    }

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.countries) {
            this.countryOptions = [
                ...(this.countries || []).map((country) => {
                    return { value: country?._id, label: translationLang(country?.translations) };
                })
            ];
            this.setCountryAndCityValue();
        }

        if (changes.cities) {
            this.cityOptions = [
                ...(this.cities || []).map((city) => {
                    return { value: city?._id, label: translationLang(city?.translations) };
                })
            ];

            this.setCountryAndCityValue();
        }
    }

    setCountryAndCityValue = () => {
        if (!this.isEditing || !this.canteen || !this.countryOptions.length || !this.cityOptions.length) {
            return;
        }

        setTimeout(() => {
            this.form?.get('country')?.setValue(this.canteen?.streetAddress?.country || '');
            this.form?.get('city')?.setValue(this.canteen?.streetAddress?.city || '');

            this.form?.updateValueAndValidity();
        }, 300);
    };
}

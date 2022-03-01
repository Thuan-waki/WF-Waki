import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICanteen } from '@portal/canteen/models/canteen.model';
import { ISchool } from '@portal/school/models/school.model';
import { translationLang } from '@portal/shared/functions/translate-language';
import { ICity } from '@portal/shared/models/city.model';
import { ICountry } from '@portal/shared/models/country.model';

@Component({
    selector: 'app-school-form',
    templateUrl: './school-form.component.html',
    styleUrls: ['./school-form.component.scss']
})
export class SchoolFormComponent implements OnChanges {
    @Input() form: FormGroup | undefined;
    @Input() school: ISchool | undefined;
    @Input() canteen: ICanteen | undefined;
    @Input() countries: ICountry[] = [];
    @Input() cities: ICity[] = [];
    @Input() isLoading: boolean = true;
    @Input() isEditing: boolean = true;
    @Input() shouldDisableSaveButton: boolean = true;
    @Output() save = new EventEmitter();
    @Output() exit = new EventEmitter();
    @Output() lookupCanteen = new EventEmitter();

    countryOptions: any = [];
    cityOptions: any = [];

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
        if (!this.isEditing || !this.school || !this.countryOptions.length || !this.cityOptions.length) {
            return;
        }

        setTimeout(() => {
            const country = this.countryOptions.find(
                (country: any) => country.label === translationLang(this.school?.country?.translations)
            );
            this.form?.get('country')?.setValue(country?.value || '');

            const city = this.cityOptions.find((city: any) => city.label === translationLang(this.school?.city?.translations));
            this.form?.get('city')?.setValue(city?.value || '');

            this.form?.updateValueAndValidity();
        }, 300);
    };
}

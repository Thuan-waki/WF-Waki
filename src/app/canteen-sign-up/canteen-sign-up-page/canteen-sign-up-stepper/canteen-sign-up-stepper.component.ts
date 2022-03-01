import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-canteen-sign-up-stepper',
    templateUrl: './canteen-sign-up-stepper.component.html',
    styleUrls: ['./canteen-sign-up-stepper.component.scss']
})
export class CanteenSignUpStepperComponent {
    @Input() currentStep = 1;

    constructor() {}
}

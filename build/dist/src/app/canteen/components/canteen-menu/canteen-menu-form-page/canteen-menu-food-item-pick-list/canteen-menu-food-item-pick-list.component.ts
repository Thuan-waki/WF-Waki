import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFoodItem } from '@portal/canteen/models/food-item.model';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';

@Component({
    selector: 'app-canteen-menu-food-item-pick-list',
    templateUrl: './canteen-menu-food-item-pick-list.component.html',
    styleUrls: ['./canteen-menu-food-item-pick-list.component.scss']
})
export class CanteenMenuFoodItemPickListComponent {
    @Input() selectedFoodItems: IFoodItem[] = [];
    @Input() selectMode = true;
    @Output() remove = new EventEmitter<IFoodItem>();

    imageServerUrl = getImageServerUrl();

    constructor() {}
}

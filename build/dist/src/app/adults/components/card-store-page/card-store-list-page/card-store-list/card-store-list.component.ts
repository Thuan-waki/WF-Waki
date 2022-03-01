import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultCardStoreFilter, ICardStoreFilter, IStoreItem } from '@portal/adults/models/card-store.model';
import { ComponentBase } from '@portal/shared/components/component-base';
import { getImageServerUrl } from '@portal/shared/functions/get-base-url';

@Component({
  selector: 'app-card-store-list',
  templateUrl: './card-store-list.component.html',
  styleUrls: ['./card-store-list.component.scss']
})
export class CardStoreListComponent extends ComponentBase {
  @Input() isLoading = true;
  @Input() isAdmin = false;
  @Input() storeItems: IStoreItem[] = [];
  @Input() recordCount = 0;
  @Input() maxPage = 0;
  @Input() pageSize = defaultCardStoreFilter.limit || 10;
  @Output() filter = new EventEmitter<ICardStoreFilter>();
  @Output() newStoreItem = new EventEmitter();
  @Output() updateStoreItem = new EventEmitter();
  @Output() goToEditStoreItem = new EventEmitter<string>();
  @Output() export = new EventEmitter();

  imageServerUrl = getImageServerUrl();
  currentPage = 1;

  constructor() {
    super();
  }

  filterRecord = () => {
    this.filter.emit(defaultCardStoreFilter);
  };

  goToPage = (pageNumber: number) => {
    this.currentPage = pageNumber;
    this.filterRecord();
  };

  get infoText() {
    return `Page ${this.currentPage} of ${this.maxPage} from ${this.recordCount} records`;
  }

}

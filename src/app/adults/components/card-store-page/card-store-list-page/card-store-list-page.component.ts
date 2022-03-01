import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultCardStoreFilter, IStoreItem, ICardStoreFilter } from '@portal/adults/models/card-store.model';
import { CardStoreService } from '@portal/adults/services/card-store.service';
import { AuthService } from '@portal/auth/services/auth.service';
import { ComponentBase } from '@portal/shared/components/component-base';
import { X_TOTAL_COUNT } from '@portal/shared/constants/common.constants';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { ExcelExportService } from '@portal/shared/services/excel-export.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-card-store-list-page',
  templateUrl: './card-store-list-page.component.html',
  styleUrls: ['./card-store-list-page.component.scss']
})
export class CardStoreListPageComponent extends ComponentBase implements OnInit {
  isLoading = true;
  isAdmin = false;
  storeItems: IStoreItem[] = [];
  recordCount = 0;
  maxPage = 0;
  pageSize = defaultCardStoreFilter.limit || 10;

  constructor(
    private excelExportService: ExcelExportService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cardStoreService: CardStoreService
  ) {
    super();
    this.isAdmin = this.authService.isAdminOrSuperAdmin();
  }

  ngOnInit(): void {
    this.getCardStore(defaultCardStoreFilter);
  }

  getCardStore = (filter: ICardStoreFilter) => {
    this.cardStoreService.getAllCardStore(filter)
      .pipe(
        tap((result: HttpResponse<IApiResult>) => {
          if (result.body?.success) {
            this.storeItems = result.body?.storeItems || [];
            this.recordCount = Number(result.headers?.get(X_TOTAL_COUNT) || 0);
            const numberOfPages = this.recordCount / this.pageSize;
            this.maxPage = numberOfPages <= 1 ? 1 : Math.ceil(numberOfPages);
          }

          if (!result.body?.success) {
            this.toastr.error('Failed to retrieve card store', 'Card Store');
          }

          this.isLoading = false;
        }),
        takeUntil(this.destroyed$),
        catchError((err: IApiFailure) => {
          this.toastr.error('Failed to load card store', 'Card Store');
          this.isLoading = false;
          return of();
        })
      )
      .subscribe();
  }

  newStoreItem = () => {
    this.router.navigate(['/adults/card-store/form']);
  };

  updateStoreItem = (currentCard: IStoreItem) => {
    this.cardStoreService.patchStoreItem(currentCard._id, { isPublished: currentCard.isPublished })
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => {
          this.isLoading = false;
          this.toastr.error('Updating card item failed', 'Card Item');

          return of<HttpEvent<IApiResult>>();
        })
      )
      .subscribe((res: any) => {
        if (res.type === HttpEventType.Response) {
          this.toastr.success('Updating card item success', 'Card Item');
          this.isLoading = false;
        }
      });
  }

  goToEditStoreItem = (cardId: string) => {
    this.router.navigate([`/adults/card-store/form/${cardId}`]);
  };

  exportToExcel = () => {
    const rows = this.storeItems.map((row) => {
      const r: any = {};

      r['Theme'] = row.theme || row.color;
      r['Type'] = row.type;
      r['Price per Item'] = row.pricePerItem;
      r['Quantity'] = row.availableQuantity;
      r['# of Orders'] = row.totalNoOfPurchases;

      return r;
    });

    this.excelExportService.exportExcel(rows, `Card Store`);
  };

}

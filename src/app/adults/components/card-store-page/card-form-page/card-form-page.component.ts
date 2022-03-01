import { Component } from '@angular/core';
import { ComponentBase } from '@portal/shared/components/component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { IStoreItem } from '@portal/adults/models/card-store.model';
import { ToastrService } from 'ngx-toastr';
import { CardStoreService } from '@portal/adults/services/card-store.service';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { IApiFailure, IApiResult } from '@portal/shared/models/api-result.model';
import { of, zip } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-card-form-page',
  templateUrl: './card-form-page.component.html',
  styleUrls: ['./card-form-page.component.scss']
})
export class CardFormPageComponent extends ComponentBase {
  card: IStoreItem | undefined;
  cardId: string = '';
  isLoading: boolean = false;
  isEditing: boolean = false;
  currentImage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cardStoreService: CardStoreService
  ) {
    super();

    this.cardId = this.route.snapshot.params.id;
    if (this.cardId) {
      this.isEditing = true;
      this.getCard(this.cardId);
    }
  }

  getCard = (id: string) => {
    this.isLoading = true;
    this.cardStoreService.getStoreItem(id)
      .pipe(
        tap((result: IApiResult) => {
          if (result.success) {
            this.card = result.storeItem;
          }

          if (!result.success) {
            this.toastr.error('Failed to retrieve card item', 'Edit Card Item');
          }

          this.isLoading = false;
        }),
        takeUntil(this.destroyed$),
        catchError((err: IApiFailure) => {
          this.isLoading = false;
          this.toastr.error('Missing Id', 'Edit Card Item');
          this.goToCardStore();
          return of();
        })
      ).subscribe();
  }

  save = (card: any) => {
    this.isLoading = true;

    if (this.isEditing) {
      const reqArr = [];

      if (this.currentImage && this.currentImage.length) {
        reqArr.push(this.cardStoreService.patchImageStoreItem(this.cardId, this.currentImage))
      }
      reqArr.push(this.cardStoreService.patchStoreItem(this.cardId, card));

      zip(...reqArr)
        .pipe(
          takeUntil(this.destroyed$),
          catchError(() => {
            this.isLoading = false;
            this.toastr.error('Updating card item failed', 'Edit Card Item');

            return of<HttpEvent<IApiResult>>();
          })
        )
        .subscribe((res: any) => {
          if (res.every((r: any) => r.type === HttpEventType.Response)) {
            this.toastr.success('Updating card item success', 'Edit Card Item');
            this.goToCardStore();
          }
        })

      return;
    }

    this.cardStoreService.postStoreItem(card, this.currentImage)
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => {
          this.isLoading = false;
          this.toastr.error('Saving card item failed', 'Create Card Item');

          return of<HttpEvent<IApiResult>>();
        })
      )
      .subscribe((res: any) => {
        if (res.type === HttpEventType.Response) {
          this.toastr.success('Saving card item success', 'Create Card Item');
          this.goToCardStore();
        }
      });
  }

  goToCardStore = () => {
    this.router.navigate(['/adults/card-store']);
  };

  setCurrentImage = (image: any) => {
    this.currentImage = image;
  }
}

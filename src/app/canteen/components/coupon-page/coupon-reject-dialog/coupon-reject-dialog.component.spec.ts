import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponRejectDialogComponent } from './coupon-reject-dialog.component';

describe('CouponRejectDialogComponent', () => {
  let component: CouponRejectDialogComponent;
  let fixture: ComponentFixture<CouponRejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponRejectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponFormPageComponent } from './coupon-form-page.component';

describe('CouponFormPageComponent', () => {
  let component: CouponFormPageComponent;
  let fixture: ComponentFixture<CouponFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

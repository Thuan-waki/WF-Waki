import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestListPageComponent } from './refund-request-list-page.component';

describe('RefundRequestListPageComponent', () => {
  let component: RefundRequestListPageComponent;
  let fixture: ComponentFixture<RefundRequestListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundRequestListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundRequestListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

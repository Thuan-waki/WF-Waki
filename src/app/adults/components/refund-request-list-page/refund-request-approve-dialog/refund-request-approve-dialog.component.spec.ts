import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestApproveDialogComponent } from './refund-request-approve-dialog.component';

describe('RefundRequestApproveDialogComponent', () => {
  let component: RefundRequestApproveDialogComponent;
  let fixture: ComponentFixture<RefundRequestApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundRequestApproveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundRequestApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOrderApprovalDialogComponent } from './card-order-approval-dialog.component';

describe('CardOrderApprovalDialogComponent', () => {
  let component: CardOrderApprovalDialogComponent;
  let fixture: ComponentFixture<CardOrderApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardOrderApprovalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardOrderApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

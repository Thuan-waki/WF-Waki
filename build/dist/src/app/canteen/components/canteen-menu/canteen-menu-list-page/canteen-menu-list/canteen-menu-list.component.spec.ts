import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenMenuListComponent } from './canteen-menu-list.component';

describe('CanteenMenuListComponent', () => {
  let component: CanteenMenuListComponent;
  let fixture: ComponentFixture<CanteenMenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenMenuListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

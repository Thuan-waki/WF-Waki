import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenListComponent } from './canteen-list.component';

describe('CanteenListComponent', () => {
  let component: CanteenListComponent;
  let fixture: ComponentFixture<CanteenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

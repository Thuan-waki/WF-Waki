import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolListPageComponent } from './school-list-page.component';

describe('SchoolListPageComponent', () => {
  let component: SchoolListPageComponent;
  let fixture: ComponentFixture<SchoolListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

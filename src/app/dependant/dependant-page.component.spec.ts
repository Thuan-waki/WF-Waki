import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependantPageComponent } from './dependant-page.component';

describe('DependantPageComponent', () => {
  let component: DependantPageComponent;
  let fixture: ComponentFixture<DependantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependantPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

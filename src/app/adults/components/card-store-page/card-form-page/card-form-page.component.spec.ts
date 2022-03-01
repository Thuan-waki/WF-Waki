import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormPageComponent } from './card-form-page.component';

describe('CardFormPageComponent', () => {
  let component: CardFormPageComponent;
  let fixture: ComponentFixture<CardFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

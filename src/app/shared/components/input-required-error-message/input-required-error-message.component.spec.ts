import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRequiredErrorMessageComponent } from './input-required-error-message.component';

describe('InputRequiredErrorMessageComponent', () => {
  let component: InputRequiredErrorMessageComponent;
  let fixture: ComponentFixture<InputRequiredErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputRequiredErrorMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRequiredErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

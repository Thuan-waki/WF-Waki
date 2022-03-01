import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsListPageComponent } from './logs-list-page.component';

describe('LogsListPageComponent', () => {
  let component: LogsListPageComponent;
  let fixture: ComponentFixture<LogsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

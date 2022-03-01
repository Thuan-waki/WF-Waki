import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStoreListPageComponent } from './card-store-list-page.component';

describe('CardStoreListPageComponent', () => {
  let component: CardStoreListPageComponent;
  let fixture: ComponentFixture<CardStoreListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardStoreListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStoreListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

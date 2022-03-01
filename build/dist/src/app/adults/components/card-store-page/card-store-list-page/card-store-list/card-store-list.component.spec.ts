import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStoreListComponent } from './card-store-list.component';

describe('CardStoreListComponent', () => {
  let component: CardStoreListComponent;
  let fixture: ComponentFixture<CardStoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardStoreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

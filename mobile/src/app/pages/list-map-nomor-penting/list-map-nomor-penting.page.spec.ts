import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMapNomorPentingPage } from './list-map-nomor-penting.page';

describe('ListMapNomorPentingPage', () => {
  let component: ListMapNomorPentingPage;
  let fixture: ComponentFixture<ListMapNomorPentingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMapNomorPentingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMapNomorPentingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantuanPage } from './bantuan.page';

describe('BantuanPage', () => {
  let component: BantuanPage;
  let fixture: ComponentFixture<BantuanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantuanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantuanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ESamsatPage } from './e-samsat.page';

describe('ESamsatPage', () => {
  let component: ESamsatPage;
  let fixture: ComponentFixture<ESamsatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ESamsatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ESamsatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

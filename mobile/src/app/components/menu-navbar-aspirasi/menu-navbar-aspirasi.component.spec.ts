import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNavbarAspirasiComponent } from './menu-navbar-aspirasi.component';

describe('MenuNavbarAspirasiComponent', () => {
  let component: MenuNavbarAspirasiComponent;
  let fixture: ComponentFixture<MenuNavbarAspirasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuNavbarAspirasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNavbarAspirasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DidNotRegisterComponent } from './did-not-register.component';

describe('DidNotRegisterComponent', () => {
  let component: DidNotRegisterComponent;
  let fixture: ComponentFixture<DidNotRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DidNotRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidNotRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAspirasiComponent } from './my-aspirasi.component';

describe('MyAspirasiComponent', () => {
  let component: MyAspirasiComponent;
  let fixture: ComponentFixture<MyAspirasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAspirasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAspirasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

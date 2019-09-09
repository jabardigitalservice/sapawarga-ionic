import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceProfileComponent } from './force-profile.component';

describe('ForceProfileComponent', () => {
  let component: ForceProfileComponent;
  let fixture: ComponentFixture<ForceProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

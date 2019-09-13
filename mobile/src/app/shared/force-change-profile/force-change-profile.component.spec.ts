import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceChangeProfileComponent } from './force-change-profile.component';

describe('ForceChangeProfileComponent', () => {
  let component: ForceChangeProfileComponent;
  let fixture: ComponentFixture<ForceChangeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceChangeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

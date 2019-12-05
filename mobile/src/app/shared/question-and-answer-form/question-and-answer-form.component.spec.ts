import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAndAnswerFormComponent } from './question-and-answer-form.component';

describe('QuestionAndAnswerFormComponent', () => {
  let component: QuestionAndAnswerFormComponent;
  let fixture: ComponentFixture<QuestionAndAnswerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAndAnswerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAndAnswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAndAnswerPage } from './question-and-answer.page';

describe('QuestionAndAnswerPage', () => {
  let component: QuestionAndAnswerPage;
  let fixture: ComponentFixture<QuestionAndAnswerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAndAnswerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAndAnswerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFrameComponent } from './question-frame.component';

describe('QuestionFrameComponent', () => {
  let component: QuestionFrameComponent;
  let fixture: ComponentFixture<QuestionFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

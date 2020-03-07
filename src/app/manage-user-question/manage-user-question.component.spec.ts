import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserQuestionComponent } from './manage-user-question.component';

describe('ManageUserQuestionComponent', () => {
  let component: ManageUserQuestionComponent;
  let fixture: ComponentFixture<ManageUserQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUserQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

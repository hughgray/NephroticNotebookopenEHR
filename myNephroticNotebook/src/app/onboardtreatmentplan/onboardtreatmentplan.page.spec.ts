import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardtreatmentplanPage } from './onboardtreatmentplan.page';

describe('OnboardtreatmentplanPage', () => {
  let component: OnboardtreatmentplanPage;
  let fixture: ComponentFixture<OnboardtreatmentplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardtreatmentplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardtreatmentplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

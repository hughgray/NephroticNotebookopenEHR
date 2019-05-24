import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardothermedsPage } from './onboardothermeds.page';

describe('OnboardothermedsPage', () => {
  let component: OnboardothermedsPage;
  let fixture: ComponentFixture<OnboardothermedsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardothermedsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardothermedsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

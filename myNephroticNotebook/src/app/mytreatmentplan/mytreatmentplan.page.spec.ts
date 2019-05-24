import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytreatmentplanPage } from './mytreatmentplan.page';

describe('MytreatmentplanPage', () => {
  let component: MytreatmentplanPage;
  let fixture: ComponentFixture<MytreatmentplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytreatmentplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytreatmentplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

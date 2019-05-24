import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreReadingPage } from './pre-reading.page';

describe('PreReadingPage', () => {
  let component: PreReadingPage;
  let fixture: ComponentFixture<PreReadingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreReadingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreReadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

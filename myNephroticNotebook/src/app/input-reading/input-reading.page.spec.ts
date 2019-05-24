import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputReadingPage } from './input-reading.page';

describe('InputReadingPage', () => {
  let component: InputReadingPage;
  let fixture: ComponentFixture<InputReadingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputReadingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputReadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

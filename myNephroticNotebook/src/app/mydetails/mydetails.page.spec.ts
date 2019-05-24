import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydetailsPage } from './mydetails.page';

describe('MydetailsPage', () => {
  let component: MydetailsPage;
  let fixture: ComponentFixture<MydetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportlogPage } from './exportlog.page';

describe('ExportlogPage', () => {
  let component: ExportlogPage;
  let fixture: ComponentFixture<ExportlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

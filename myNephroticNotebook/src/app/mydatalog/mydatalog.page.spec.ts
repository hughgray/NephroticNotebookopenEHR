import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydatalogPage } from './mydatalog.page';

describe('MydatalogPage', () => {
  let component: MydatalogPage;
  let fixture: ComponentFixture<MydatalogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydatalogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydatalogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

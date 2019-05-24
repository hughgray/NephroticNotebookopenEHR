import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckProfilePage } from './check-profile.page';

describe('CheckProfilePage', () => {
  let component: CheckProfilePage;
  let fixture: ComponentFixture<CheckProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReadingPage } from './post-reading.page';

describe('PostReadingPage', () => {
  let component: PostReadingPage;
  let fixture: ComponentFixture<PostReadingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostReadingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostReadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

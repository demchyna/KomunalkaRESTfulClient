import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 403PageComponent } from './403-page.component';

describe('403PageComponent', () => {
  let component: 403PageComponent;
  let fixture: ComponentFixture<403PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 403PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(403PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

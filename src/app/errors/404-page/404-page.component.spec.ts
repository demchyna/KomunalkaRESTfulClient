import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { E404PageComponent } from './404-page.component';

describe('404PageComponent', () => {
  let component: E404PageComponent;
  let fixture: ComponentFixture<E404PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ E404PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(E404PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachAccountComponent } from './attach-account.component';

describe('AttachAccountComponent', () => {
  let component: AttachAccountComponent;
  let fixture: ComponentFixture<AttachAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

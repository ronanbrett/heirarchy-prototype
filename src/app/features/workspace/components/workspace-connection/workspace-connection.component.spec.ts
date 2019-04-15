import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceConnectionComponent } from './workspace-connection.component';

describe('WorkspaceConnectionComponent', () => {
  let component: WorkspaceConnectionComponent;
  let fixture: ComponentFixture<WorkspaceConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNodeEmptyComponent } from './workspace-node-empty.component';

describe('WorkspaceNodeEmptyComponent', () => {
  let component: WorkspaceNodeEmptyComponent;
  let fixture: ComponentFixture<WorkspaceNodeEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceNodeEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceNodeEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

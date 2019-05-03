import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNodeRootComponent } from './workspace-node-root.component';

describe('WorkspaceNodeRootComponent', () => {
  let component: WorkspaceNodeRootComponent;
  let fixture: ComponentFixture<WorkspaceNodeRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceNodeRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceNodeRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

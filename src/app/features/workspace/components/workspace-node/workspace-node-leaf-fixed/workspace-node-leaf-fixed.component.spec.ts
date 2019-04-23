import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNodeLeafFixedComponent } from './workspace-node-leaf-fixed.component';

describe('WorkspaceNodeLeafFixedComponent', () => {
  let component: WorkspaceNodeLeafFixedComponent;
  let fixture: ComponentFixture<WorkspaceNodeLeafFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceNodeLeafFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceNodeLeafFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

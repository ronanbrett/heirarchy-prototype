import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNodeLeafComponent } from './workspace-node-leaf.component';

describe('WorkspaceNodeLeafComponent', () => {
  let component: WorkspaceNodeLeafComponent;
  let fixture: ComponentFixture<WorkspaceNodeLeafComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceNodeLeafComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceNodeLeafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

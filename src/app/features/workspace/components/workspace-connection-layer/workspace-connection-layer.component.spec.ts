import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceConnectionLayerComponent } from './workspace-connection-layer.component';

describe('WorkspaceConnectionLayerComponent', () => {
  let component: WorkspaceConnectionLayerComponent;
  let fixture: ComponentFixture<WorkspaceConnectionLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceConnectionLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceConnectionLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

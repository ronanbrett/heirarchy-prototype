import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceConnectionLinkComponent } from './workspace-connection-link.component';

describe('WorkspaceConnectionLinkComponent', () => {
  let component: WorkspaceConnectionLinkComponent;
  let fixture: ComponentFixture<WorkspaceConnectionLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceConnectionLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceConnectionLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

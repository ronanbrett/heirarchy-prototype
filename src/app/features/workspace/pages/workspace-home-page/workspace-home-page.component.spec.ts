import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceHomePageComponent } from './workspace-home-page.component';

describe('WorkspaceHomePageComponent', () => {
  let component: WorkspaceHomePageComponent;
  let fixture: ComponentFixture<WorkspaceHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

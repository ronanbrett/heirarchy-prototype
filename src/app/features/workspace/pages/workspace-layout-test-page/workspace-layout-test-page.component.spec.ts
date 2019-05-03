import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLayoutTestPageComponent } from './workspace-layout-test-page.component';

describe('WorkspaceLayoutTestPageComponent', () => {
  let component: WorkspaceLayoutTestPageComponent;
  let fixture: ComponentFixture<WorkspaceLayoutTestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLayoutTestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceLayoutTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

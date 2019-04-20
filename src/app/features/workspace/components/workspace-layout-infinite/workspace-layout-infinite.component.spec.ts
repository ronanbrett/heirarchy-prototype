import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLayoutInfiniteComponent } from './workspace-layout-infinite.component';

describe('WorkspaceLayoutInfiniteComponent', () => {
  let component: WorkspaceLayoutInfiniteComponent;
  let fixture: ComponentFixture<WorkspaceLayoutInfiniteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLayoutInfiniteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceLayoutInfiniteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

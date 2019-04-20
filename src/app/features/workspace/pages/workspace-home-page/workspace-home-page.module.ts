import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceHomePageComponent } from './workspace-home-page.component';
import { WorkspaceNodeModule } from '../../components/workspace-node/workspace-node.module';
import { WorkspaceLayoutModule } from '../../components/workspace-layout/workspace-layout.module';
import { WorkspaceLayoutInfiniteModule } from '../../components/workspace-layout-infinite/workspace-layout-infinite.module';

@NgModule({
  declarations: [WorkspaceHomePageComponent],
  imports: [
    CommonModule,
    WorkspaceLayoutModule,
    WorkspaceNodeModule,
    WorkspaceLayoutInfiniteModule
  ],
  exports: [WorkspaceHomePageComponent]
})
export class WorkspaceHomePageModule { }

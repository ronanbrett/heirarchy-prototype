import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutTestPageComponent } from './workspace-layout-test-page.component';
import { WorkspaceLayoutInfiniteModule } from '../../components/workspace-layout-infinite/workspace-layout-infinite.module';
import { MatButtonModule } from '@angular/material';
import { WorkspaceHeaderModule } from '../../components/workspace-header/workspace-header.module';

@NgModule({
  declarations: [WorkspaceLayoutTestPageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    WorkspaceLayoutInfiniteModule,
    WorkspaceHeaderModule
  ],
  exports: [WorkspaceLayoutTestPageComponent]
})
export class WorkspaceLayoutTestPageModule {}

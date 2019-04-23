import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutTestPageComponent } from './workspace-layout-test-page.component';
import { WorkspaceLayoutInfiniteModule } from '../../components/workspace-layout-infinite/workspace-layout-infinite.module';

@NgModule({
  declarations: [WorkspaceLayoutTestPageComponent],
  imports: [CommonModule, WorkspaceLayoutInfiniteModule],
  exports: [WorkspaceLayoutTestPageComponent],
})
export class WorkspaceLayoutTestPageModule {}

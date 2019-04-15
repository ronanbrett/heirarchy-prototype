import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { WorkspaceNodeModule } from '../workspace-node/workspace-node.module';

@NgModule({
  declarations: [WorkspaceLayoutComponent],
  imports: [
    CommonModule,
    WorkspaceNodeModule
  ],
  exports: [WorkspaceLayoutComponent]
})
export class WorkspaceLayoutModule { }

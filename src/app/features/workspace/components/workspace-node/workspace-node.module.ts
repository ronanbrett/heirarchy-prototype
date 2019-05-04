import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceNodeLeafFixedComponent } from './workspace-node-leaf-fixed/workspace-node-leaf-fixed.component';

@NgModule({
  declarations: [WorkspaceNodeLeafFixedComponent],
  imports: [CommonModule],
  exports: [WorkspaceNodeLeafFixedComponent]
})
export class WorkspaceNodeModule {}

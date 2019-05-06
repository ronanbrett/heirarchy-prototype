import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceNodeLeafFixedComponent } from './workspace-node-leaf-fixed/workspace-node-leaf-fixed.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [WorkspaceNodeLeafFixedComponent],
  imports: [CommonModule, DragDropModule],
  exports: [WorkspaceNodeLeafFixedComponent]
})
export class WorkspaceNodeModule {}

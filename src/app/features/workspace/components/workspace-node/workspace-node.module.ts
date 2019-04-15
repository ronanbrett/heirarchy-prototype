import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceNodeRootComponent } from './workspace-node-root/workspace-node-root.component';
import { WorkspaceNodeLeafComponent } from './workspace-node-leaf/workspace-node-leaf.component';
import { WorkspaceNodeEmptyComponent } from './workspace-node-empty/workspace-node-empty.component';
import { WorkspaceConnectionModule } from '../workspace-connection/workspace-connection.module';

@NgModule({
  declarations: [
    WorkspaceNodeRootComponent,
    WorkspaceNodeLeafComponent,
    WorkspaceNodeEmptyComponent,
  ],
  imports: [CommonModule, WorkspaceConnectionModule],
  exports: [
    WorkspaceNodeRootComponent,
    WorkspaceNodeLeafComponent,
    WorkspaceNodeEmptyComponent,
  ],
})
export class WorkspaceNodeModule {}

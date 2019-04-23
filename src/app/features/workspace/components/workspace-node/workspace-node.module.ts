import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceNodeRootComponent } from './workspace-node-root/workspace-node-root.component';
import { WorkspaceNodeLeafComponent } from './workspace-node-leaf/workspace-node-leaf.component';
import { WorkspaceNodeEmptyComponent } from './workspace-node-empty/workspace-node-empty.component';
import { WorkspaceConnectionModule } from '../workspace-connection/workspace-connection.module';
import { WorkspaceNodeLeafFixedComponent } from './workspace-node-leaf-fixed/workspace-node-leaf-fixed.component';
import { WorkspaceConnectionLinkModule } from '../workspace-connection-link/workspace-connection-link.module';

@NgModule({
  declarations: [
    WorkspaceNodeRootComponent,
    WorkspaceNodeLeafComponent,
    WorkspaceNodeEmptyComponent,
    WorkspaceNodeLeafFixedComponent,
  ],
  imports: [
    CommonModule,
    WorkspaceConnectionModule,
    WorkspaceConnectionLinkModule,
  ],
  exports: [
    WorkspaceNodeRootComponent,
    WorkspaceNodeLeafComponent,
    WorkspaceNodeEmptyComponent,
    WorkspaceNodeLeafFixedComponent,
  ],
})
export class WorkspaceNodeModule {}

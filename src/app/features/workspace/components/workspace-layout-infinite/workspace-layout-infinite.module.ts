import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutInfiniteComponent } from './workspace-layout-infinite.component';
import { WorkspaceNodeModule } from '../workspace-node/workspace-node.module';
import { WorkspaceConnectionLayerModule } from '../workspace-connection-layer/workspace-connection-layer.module';
import { WorkspaceConnectionLinkModule } from '../workspace-connection-link/workspace-connection-link.module';

@NgModule({
  declarations: [WorkspaceLayoutInfiniteComponent],
  imports: [
    CommonModule,
    WorkspaceNodeModule,
    WorkspaceConnectionLayerModule,
    WorkspaceConnectionLinkModule
  ],
  exports: [WorkspaceLayoutInfiniteComponent]
})
export class WorkspaceLayoutInfiniteModule {}

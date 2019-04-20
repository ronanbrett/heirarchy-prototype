import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { WorkspaceNodeModule } from '../workspace-node/workspace-node.module';
import { WorkspaceConnectionLayerModule } from '../workspace-connection-layer/workspace-connection-layer.module';

@NgModule({
  declarations: [WorkspaceLayoutComponent],
  imports: [
    CommonModule,
    WorkspaceNodeModule,
    WorkspaceConnectionLayerModule
  ],
  exports: [WorkspaceLayoutComponent]
})
export class WorkspaceLayoutModule { }

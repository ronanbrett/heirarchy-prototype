import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceHomePageComponent } from './workspace-home-page.component';
import { WorkspaceNodeModule } from '../../components/workspace-node/workspace-node.module';
import { WorkspaceLayoutModule } from '../../components/workspace-layout/workspace-layout.module';

@NgModule({
  declarations: [WorkspaceHomePageComponent],
  imports: [
    CommonModule,
    WorkspaceLayoutModule,
    WorkspaceNodeModule
  ],
  exports: [WorkspaceHomePageComponent]
})
export class WorkspaceHomePageModule { }

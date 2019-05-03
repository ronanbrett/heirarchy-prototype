import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceHomePageModule } from './pages/workspace-home-page/workspace-home-page.module';
import { WorkspaceLayoutTestPageModule } from './pages/workspace-layout-test-page/workspace-layout-test-page.module';
import { AttachAccountModule } from './entry/attach-account/attach-account.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    WorkspaceHomePageModule,
    WorkspaceLayoutTestPageModule,
    AttachAccountModule
  ],
  entryComponents: [

  ]
})
export class WorkspaceModule { }

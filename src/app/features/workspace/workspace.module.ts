import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceHomePageModule } from './pages/workspace-home-page/workspace-home-page.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    WorkspaceHomePageModule
  ]
})
export class WorkspaceModule { }

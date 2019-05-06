import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceLayoutTestPageComponent } from './pages/workspace-layout-test-page/workspace-layout-test-page.component';
import { AttachAccountComponent } from './entry/attach-account/attach-account.component';
import { ViewNodeComponent } from './entry/view-node/view-node.component';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
import { WorkspaceHistoryComponent } from './entry/workspace-history/workspace-history.component';
import { WorkspaceMetadataComponent } from './entry/workspace-metadata/workspace-metadata.component';
import { MoveNodeComponent } from './entry/move-node/move-node.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceLayoutTestPageComponent,
    children: []
  },
  {
    path: 'attach',
    component: AttachAccountComponent,
    outlet: 'endside'
  },
  {
    path: 'view',
    component: ViewNodeComponent,
    outlet: 'endside'
  },
  {
    path: 'move',
    component: MoveNodeComponent,
    outlet: 'endside'
  },
  {
    path: 'ws',
    component: WorkspaceHeaderComponent,
    outlet: 'header'
  },
  {
    path: 'history',
    component: WorkspaceHistoryComponent,
    outlet: 'startside'
  },
  {
    path: 'info',
    component: WorkspaceMetadataComponent,
    outlet: 'startside'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}

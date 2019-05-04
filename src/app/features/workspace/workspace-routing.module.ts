import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceLayoutTestPageComponent } from './pages/workspace-layout-test-page/workspace-layout-test-page.component';
import { AttachAccountComponent } from './entry/attach-account/attach-account.component';

const routes: Routes = [
  {
    path: 'test',
    component: WorkspaceLayoutTestPageComponent
  },
  {
    path: 'attach',
    component: AttachAccountComponent,
    outlet: 'side'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}

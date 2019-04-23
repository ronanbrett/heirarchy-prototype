import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceHomePageComponent } from './pages/workspace-home-page/workspace-home-page.component';
import { WorkspaceLayoutTestPageComponent } from './pages/workspace-layout-test-page/workspace-layout-test-page.component';

const routes: Routes = [{
  path: '',
  component: WorkspaceHomePageComponent
},
{
  path: 'test',
  component: WorkspaceLayoutTestPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }

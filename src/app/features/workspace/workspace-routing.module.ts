import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceHomePageComponent } from './pages/workspace-home-page/workspace-home-page.component';

const routes: Routes = [{
  path: '',
  component: WorkspaceHomePageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }

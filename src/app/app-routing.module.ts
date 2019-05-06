import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceHeaderComponent } from './features/workspace/components/workspace-header/workspace-header.component';

const routes: Routes = [
  { path: '', redirectTo: '/workspace/(header:ws)', pathMatch: 'full' },
  {
    path: 'workspace',
    loadChildren: './features/workspace/workspace.module#WorkspaceModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

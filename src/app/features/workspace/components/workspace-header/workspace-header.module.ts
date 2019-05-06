import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceHeaderComponent } from './workspace-header.component';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WorkspaceHeaderComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
  exports: [WorkspaceHeaderComponent]
})
export class WorkspaceHeaderModule {}

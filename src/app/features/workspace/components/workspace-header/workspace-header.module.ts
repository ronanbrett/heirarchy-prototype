import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { WorkspaceHeaderComponent } from './workspace-header.component';

@NgModule({
  declarations: [WorkspaceHeaderComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule, MatFormFieldModule, MatSelectModule],
  exports: [WorkspaceHeaderComponent]
})
export class WorkspaceHeaderModule { }

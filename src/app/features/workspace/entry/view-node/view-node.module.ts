import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewNodeComponent } from './view-node.component';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [ViewNodeComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [ViewNodeComponent]
})
export class ViewNodeModule {}

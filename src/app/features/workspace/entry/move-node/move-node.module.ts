import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveNodeComponent } from './move-node.component';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [MoveNodeComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [MoveNodeComponent]
})
export class MoveNodeModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { LayoutContainerComponent } from './layout-container.component';

@NgModule({
  declarations: [LayoutContainerComponent],
  imports: [CommonModule, MatSidenavModule],
  exports: [LayoutContainerComponent],
})
export class LayoutContainerModule {}

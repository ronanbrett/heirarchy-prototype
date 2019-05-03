import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { LayoutContainerComponent } from './layout-container.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutContainerComponent],
  imports: [CommonModule, MatSidenavModule, RouterModule],
  exports: [LayoutContainerComponent],
})
export class LayoutContainerModule {}

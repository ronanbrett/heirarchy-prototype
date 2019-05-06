import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusIndicatorComponent } from './status-indicator.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [StatusIndicatorComponent]
})
export class StatusIndicatorModule {}

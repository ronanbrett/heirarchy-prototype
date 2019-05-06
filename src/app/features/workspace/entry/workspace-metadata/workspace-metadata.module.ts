import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceMetadataComponent } from './workspace-metadata.component';
import { StatusIndicatorModule } from 'src/app/core/components/status-indicator/status-indicator.module';

@NgModule({
  declarations: [WorkspaceMetadataComponent],
  imports: [CommonModule, StatusIndicatorModule],
  exports: [WorkspaceMetadataComponent]
})
export class WorkspaceMetadataModule {}

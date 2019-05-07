import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { QuerySearchModule } from 'src/app/core/components/query-search/query-search.module';
import { StatusIndicatorModule } from 'src/app/core/components/status-indicator/status-indicator.module';
import { ViewNodeComponent } from './view-node.component';

@NgModule({
  declarations: [ViewNodeComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    StatusIndicatorModule,
    QuerySearchModule
  ],
  exports: [ViewNodeComponent]
})
export class ViewNodeModule {}

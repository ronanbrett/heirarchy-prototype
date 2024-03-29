import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachAccountComponent } from './attach-account.component';
import { QuerySearchModule } from '../../../../core/components/query-search/query-search.module';
import { MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AttachAccountComponent],
  imports: [
    CommonModule,
    QuerySearchModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule
  ],
  exports: [AttachAccountComponent]
})
export class AttachAccountModule { }

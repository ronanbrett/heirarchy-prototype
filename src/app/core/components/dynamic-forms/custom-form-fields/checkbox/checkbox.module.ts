import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  exports: [CheckboxComponent]
})
export class CheckboxModule { }

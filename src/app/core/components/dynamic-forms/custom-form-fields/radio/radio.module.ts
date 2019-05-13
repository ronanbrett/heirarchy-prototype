import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { MatRadioModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RadioComponent],
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule],
  exports: [RadioComponent]
})
export class RadioModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatRadioModule, MatCheckboxModule} from '@angular/material';
import { DynamicFieldComponent } from './dynamic-field/dynamic-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioModule } from './custom-form-fields/radio/radio.module';
import { CheckboxModule } from './custom-form-fields/checkbox/checkbox.module';

@NgModule({
  declarations: [DynamicFieldComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    RadioModule,
    CheckboxModule
  ],
  exports: [DynamicFieldComponent]
})
export class DynamicFormsModule { }

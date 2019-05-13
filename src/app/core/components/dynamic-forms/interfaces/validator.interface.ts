import { ValidatorFn } from '@angular/forms';

export interface Validator {
  name: string;
  validator: ValidatorFn;
  message: string;
}

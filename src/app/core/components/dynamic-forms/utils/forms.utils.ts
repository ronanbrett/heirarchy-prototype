import { FormGroup } from '@angular/forms';
import { areAllTrue } from './conditions.utils';

export function checkValidationOfFieldGroup(
  fields: string[],
  formGroup: FormGroup
) {
  const valids = fields.map(field => {
    return formGroup.get(field).valid || formGroup.get(field).disabled;
  });

  return areAllTrue(valids);
}

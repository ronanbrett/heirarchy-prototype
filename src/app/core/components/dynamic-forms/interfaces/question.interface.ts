import { Condition } from './conditions.interface';
import { Validator } from './validator.interface';

export interface Question<T> {
  value?: T;
  initValue?: T;
  key: string;
  label: string;
  placeholder?: string;
  validations?: Validator[];
  order?: number;
  controlType?: string;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  hint?: string;
  isVisible?: boolean;
  locked?: boolean;


  hiddenBy?: Condition[];
  disabledBy?: Condition[];

  children?: Question<any>[];


  // Number / Date
  min?: number | Date;
  max?: number | Date;

  // Text
  type?: string;
  autocomplete?: string;

  // Dropdown
  options?: { value: string; key: string }[];
}

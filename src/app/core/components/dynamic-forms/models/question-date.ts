import { QuestionBase } from './question-base';
import { Question } from '../interfaces/question.interface';
import { throwIncompatibleOptions } from '../dynamic-field/dynamic-field.errors';

export class DateQuestion extends QuestionBase<Date> {
  controlType = 'date';
  min: Date;
  max: Date;

  constructor(options: Question<Date>) {
    super(options);
    this.min = <Date> options.min;
    this.max = <Date>options.max;
  }
}

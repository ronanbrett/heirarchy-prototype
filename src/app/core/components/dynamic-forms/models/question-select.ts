import { QuestionBase } from './question-base';
import { Question } from '../interfaces/question.interface';

export interface SelectValue {
  key: string;
  value: string;
}

export class SelectQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: SelectValue[] = [];

  constructor(options: Question<string>) {
    super(options);
    this.options = options.options;
  }
}

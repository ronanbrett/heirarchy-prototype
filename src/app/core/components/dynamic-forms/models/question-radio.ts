import { QuestionBase } from './question-base';
import { Question } from '../interfaces/question.interface';

export interface RadioValue {
  key: string;
  value: string;
}

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  options: RadioValue[] = [];

  constructor(options: Question<string>) {
    super(options);
    this.options = options.options;
  }
}

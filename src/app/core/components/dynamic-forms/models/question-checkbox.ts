import { Question } from '../interfaces/question.interface';
import { QuestionBase } from './question-base';

export class CheckboxQuestion extends QuestionBase<boolean> {
  controlType = 'checkbox';

  constructor(options: Question<boolean>) {
    super(options);
    this.value = this.value !== undefined || false;
  }
}

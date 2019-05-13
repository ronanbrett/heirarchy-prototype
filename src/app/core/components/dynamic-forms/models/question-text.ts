import { QuestionBase } from './question-base';
import { Question } from '../interfaces/question.interface';

export class TextQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  autocomplete: string;
  type: string;
  min: number;
  max: number;

  constructor(options: Question<string>) {
    super(options);
    this.type = options.type;
    this.autocomplete = options.autocomplete || 'off';
    this.min = <number> options.min;
    this.max = <number> options.max;
  }
}

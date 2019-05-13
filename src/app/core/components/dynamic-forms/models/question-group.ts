import { QuestionBase } from './question-base';
import { Question } from '../interfaces/question.interface';

export class GroupQuestion extends QuestionBase<string> {
  controlType = 'group';
  children: Question<any>[];
  constructor(options: Question<string>) {
    super(options);
    this.children = options.children;
  }
}

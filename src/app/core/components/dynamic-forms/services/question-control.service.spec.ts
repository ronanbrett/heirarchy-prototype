import { TestBed } from '@angular/core/testing';
import { FormGroup, Validators } from '@angular/forms';
import { TextQuestion } from '../models/question-text';
import { QuestionControlService } from './question-control.service';


describe('QuestionControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionControlService = TestBed.get(QuestionControlService);
    expect(service).toBeTruthy();
  });

  it('should be able to create a formgroup', () => {
    const service: QuestionControlService = TestBed.get(QuestionControlService);
    const questions = [
      new TextQuestion({
        value: 'Hello',
        label: 'Text Label',
        key: 'textBoxQuestion',
      }),
    ];
    const formGroup = service.toFormGroup(questions);
    expect(formGroup instanceof FormGroup).toBeTruthy();
    expect(formGroup.get(questions[0].key)).toBeDefined();
  });

  it('should be able create a formgroup with validations', () => {
    const service: QuestionControlService = TestBed.get(QuestionControlService);
    const questions = [
      new TextQuestion({
        label: 'Text Label',
        key: 'textBoxQuestion',
        validations: [{
          name: 'test',
          validator: Validators.required,
          message: 'Validator Message'
        }]
      }),
    ];
    const formGroup = service.toFormGroup(questions);
    expect(formGroup.valid).toBeFalsy();
  })
});

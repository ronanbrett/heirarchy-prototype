import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormsModule } from '../dynamic-forms.module';
import { CheckboxQuestion } from '../models/question-checkbox';
import { DateQuestion } from '../models/question-date';
import { RadioQuestion } from '../models/question-radio';
import { SelectQuestion } from '../models/question-select';
import { TextQuestion } from '../models/question-text';
import { DynamicFieldComponent } from './dynamic-field.component';
import { throwDynamicFormMissingQuestionError } from './dynamic-field.errors';


const FORM_GROUP = new FormGroup({
  name: new FormControl(),
});

const FORM_GROUP_WITH_VALUE = new FormGroup({
  name: new FormControl('Answer1'),
});

const QUESTIONS = {
  text: new TextQuestion({
    label: 'Question',
    key: 'name',
  }),
  dropdown: new SelectQuestion({
    label: 'Text Label',
    key: 'name',
    options: [
      { key: 'Answer1', value: 'Answer1' },
      { key: 'Answer2', value: 'Answer2' },
    ],
    value: 'Answer1',
  }),
  date: new DateQuestion({
    label: 'Text Label',
    key: 'name',
  }),
  checkbox: new CheckboxQuestion({
    label: 'Text Label',
    key: 'name',
  }),
  radio: new RadioQuestion({
    label: 'Text Label',
    key: 'name',
    options: [
      { key: 'Answer1', value: 'Answer1' },
      { key: 'Answer2', value: 'Answer2' },
    ],
  }),
};

describe('DynamicFieldComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DynamicFormsModule, NoopAnimationsModule, MatNativeDateModule],
      declarations: [],
    }).compileComponents();
  }));

  describe('Question', () => {
    it('should throw without an input', () => {
      let fixture: ComponentFixture<DynamicFieldComponent>;
      fixture = TestBed.createComponent(DynamicFieldComponent);

      expect(() => fixture.detectChanges()).toThrowError(
        throwDynamicFormMissingQuestionError(),
      );
    });

    it('should throw without a formgroup', () => {
      let fixture: ComponentFixture<DynamicFieldComponent>;
      let component: DynamicFieldComponent;

      fixture = TestBed.createComponent(DynamicFieldComponent);
      component = fixture.componentInstance;
      component.question = QUESTIONS.text;

      expect(() => fixture.detectChanges()).toThrow(
        'formGroup expects a FormGroup instance.',
      );
    });
  });

  describe('Textbox Questions', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicFieldComponent);

      const question = QUESTIONS.text;

      component = fixture.componentInstance;
      component.question = question;
      component.form = FORM_GROUP;
      fixture.detectChanges();
    });

    it('should be able to create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should be able to start with a value', fakeAsync(() => {
      component.form = FORM_GROUP_WITH_VALUE;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(input.value).toBe('Answer1');
    }));
  });

  describe('Date Questions', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicFieldComponent);

      const question = QUESTIONS.date;

      component = fixture.componentInstance;
      component.question = question;
      component.form = FORM_GROUP;
      fixture.detectChanges();
    });

    it('should be able to create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  });

  describe('Radio Questions', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicFieldComponent);

      const question = QUESTIONS.radio;

      component = fixture.componentInstance;
      component.question = question;
      component.form = FORM_GROUP;
      fixture.detectChanges();
    });

    it('should be able to create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  });

  describe('Checkbox Questions', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicFieldComponent);

      const question = QUESTIONS.checkbox;

      component = fixture.componentInstance;
      component.question = question;
      component.form = FORM_GROUP;
      fixture.detectChanges();
    });

    it('should be able to create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  });

  describe('Dropdown Questions', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DynamicFieldComponent);

      const question = QUESTIONS.dropdown;

      component = fixture.componentInstance;
      component.question = question;
      component.form = FORM_GROUP_WITH_VALUE;
      fixture.detectChanges();
    });

    it('should be able to create', () => {
      expect(component).toBeTruthy();
    });

    it('should be able to start with a value', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const select = fixture.debugElement.query(
        By.css('.mat-select-value-text span'),
      ).nativeElement;

      expect(select.textContent).toBe('Answer1');
    }));
  });
});

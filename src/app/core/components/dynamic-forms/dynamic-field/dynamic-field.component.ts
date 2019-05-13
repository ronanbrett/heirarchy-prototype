import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest, Subscription, Observable, Subject } from 'rxjs';
import { Question } from '../interfaces/question.interface';
import { areAllTrue, checkForConditions } from '../utils/conditions.utils';
import { throwDynamicFormMissingQuestionError } from './dynamic-field.errors';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'inno-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./dynamic-field.component.scss']
})
export class DynamicFieldComponent implements OnInit, OnDestroy {
  @Input() question: Question<any>;
  @Input() form: FormGroup;
  @Input() label: string;

  control: any;

  isHidden = false;
  isLocked = false;

  subs: Subscription[] = [];

  notifier: Subject<void> = new Subject();

  constructor() {}

  ngOnInit() {
    if (!this.question) {
      throw throwDynamicFormMissingQuestionError();
    }

    this.isLocked = this.question.locked;

    if (this.question.hiddenBy) {
      this.checkAndSubscribeToHiddenBy();
    }

    if (this.question.disabledBy) {
      this.checkAndSubscribeToDisabledBy();
    }
  }

  checkAndSubscribeToDisabledBy() {
    const control = this.form.get(this.question.key);
    const conditions = this.question.disabledBy;

    const matches = conditions.map(x => {
      const disabledBy = this.form.get(x.key);
      return checkForConditions(x.conditions, disabledBy.value);
    });

    if (areAllTrue(matches)) {
      this.isLocked = true;
      control.disable();
    } else {
      this.isLocked = false;
      control.enable();
    }

    const observables = conditions.map(x => {
      return this.form.get(x.key).valueChanges;
    });

    const disabled$ = combineLatest(...observables)
      .pipe(takeUntil(this.notifier))
      .subscribe(disabledByFieldValues => {
        const results = disabledByFieldValues.map((value, i) => {
          const fieldConditions = conditions[i].conditions;
          return checkForConditions(fieldConditions, value);
        });
        if (
          areAllTrue(results) &&
          disabledByFieldValues.length === observables.length
        ) {
          this.isLocked = true;
          control.disable();
        } else {
          this.isLocked = false;
          control.enable();
        }
      });

    this.subs.push(disabled$);
  }

  checkAndSubscribeToHiddenBy() {
    const control = this.form.get(this.question.key);
    const conditions = this.question.hiddenBy;

    const matches = conditions.map(x => {
      const hiddenBy = this.form.get(x.key);
      return checkForConditions(x.conditions, hiddenBy.value);
    });

    if (areAllTrue(matches)) {
      control.disable();
      this.isHidden = true;
    } else {
      control.enable();
      this.isHidden = false;
    }

    const observables = conditions.map(x => {
      return this.form.get(x.key).valueChanges;
    });

    const hidden$ = combineLatest(...observables)
      .pipe(takeUntil(this.notifier))
      .subscribe(hiddenByFieldValues => {
        const results = hiddenByFieldValues.map((value, i) => {
          const fieldConditions = conditions[i].conditions;
          return checkForConditions(fieldConditions, value);
        });

        if (
          areAllTrue(results) &&
          hiddenByFieldValues.length === observables.length
        ) {
          control.disable();
          this.isHidden = true;
        } else {
          control.enable();
          this.isHidden = false;
        }
      });

    this.subs.push(hidden$);
  }

  ngOnDestroy() {
    this.notifier.next();
    this.subs.forEach(sub => sub.unsubscribe());
    this.notifier.complete();
  }
}

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import {
  CanDisableCtor,
  CanDisableRippleCtor,
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  ErrorStateMatcher,
  HasTabIndexCtor,
  MatFormField,
  MatFormFieldControl,
  MatRadioChange,
  mixinDisabled,
  mixinDisableRipple,
  mixinErrorState,
  mixinTabIndex,
} from '@angular/material';
import { Subject } from 'rxjs';

export interface RadioOption {
  key: string;
  value: string;
}

export class InnoRadioBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}

export const _InnoRadioMixinBase: CanDisableCtor &
  HasTabIndexCtor &
  CanDisableRippleCtor &
  CanUpdateErrorStateCtor &
  typeof InnoRadioBase = mixinDisableRipple(
  mixinTabIndex(mixinDisabled(mixinErrorState(InnoRadioBase))),
);

@Component({
  selector: 'inno-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: RadioComponent }],
  host: {
    '[attr.id]': 'id',
    '[attr.aria-label]': '_getAriaLabel()',
    '[attr.aria-labelledby]': '_getAriaLabelledby()',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
  },
})
export class RadioComponent extends _InnoRadioMixinBase
  implements
    MatFormFieldControl<any>,
    ControlValueAccessor,
    OnDestroy,
    CanUpdateErrorState,
    DoCheck {
  static nextId = 0;
  form: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  // ngControl = null;
  controlType = 'inno-radio';
  describedBy = '';

  private _uid = `inno-radio-${RadioComponent.nextId++}`;

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  @Input() errorStateMatcher: ErrorStateMatcher;

  _onChange = (val: any) => {};
  _onTouched = () => {};

  get empty() {
    return !this.form.get('radio').value;
  }

  get shouldLabelFloat() {
    return true;
  }

  @Input()
  get options(): RadioOption[] {
    return this._options;
  }
  set options(value: RadioOption[]) {
    this._options = value;
    this.stateChanges.next();
  }
  private _options: RadioOption[];

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): string | null {
    const {
      value: { radio },
    } = this.form;
    return radio;
  }
  set value(val: string | null) {
    this.form.setValue({ radio: val });
    this._onChange(val);
    this.stateChanges.next();
  }

  _ariaDescribedby: string;
  @Input('aria-label') ariaLabel: string = '';
  @Input('aria-labelledby') ariaLabelledby: string;

  constructor(
    private fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    elementRef: ElementRef,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() private _parentFormField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    super(
      elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.form = this.fb.group({
      radio: null,
    });

    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this._onTouched();
      this.stateChanges.next();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  onUpdate(change: MatRadioChange) {
    this.value = change.value;
  }

  writeValue(val) {
    this.value = val;
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  _getAriaLabel(): string | null {
    // If an ariaLabelledby value has been set by the consumer, the select should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
  }

  /** Returns the aria-labelledby of the select component. */
  _getAriaLabelledby(): string | null {
    if (this.ariaLabelledby) {
      return this.ariaLabelledby;
    }

    // Note: we use `_getAriaLabel` here, because we want to check whether there's a
    // computed label. `this.ariaLabel` is only the user-specified label.
    if (
      !this._parentFormField ||
      !this._parentFormField._hasFloatingLabel() ||
      this._getAriaLabel()
    ) {
      return null;
    }

    return this._parentFormField._labelId || null;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
  }
}

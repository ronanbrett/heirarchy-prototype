// tslint:disable:use-host-property-decorator

import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Optional,
  Self,
  Attribute,
  ViewEncapsulation,
  OnDestroy,
  DoCheck,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ErrorStateMatcher,
  CanDisableCtor,
  HasTabIndexCtor,
  CanDisableRippleCtor,
  CanUpdateErrorStateCtor,
  mixinDisableRipple,
  mixinTabIndex,
  mixinDisabled,
  mixinErrorState,
  MatFormField,
  MatFormFieldControl,
  MatCheckboxChange,
  CanUpdateErrorState,
  CanDisable,
} from '@angular/material';
import {
  NgForm,
  FormGroupDirective,
  NgControl,
  FormGroup,
  FormBuilder,
  ControlValueAccessor,
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export interface CheckboxOption {
  key: string;
  value: string;
}

export class InnoCheckboxBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}

export const _InnoCheckboxMixinBase: CanDisableCtor &
  HasTabIndexCtor &
  CanDisableRippleCtor &
  CanUpdateErrorStateCtor &
  typeof InnoCheckboxBase = mixinDisableRipple(
  mixinTabIndex(mixinDisabled(mixinErrorState(InnoCheckboxBase))),
);

@Component({
  selector: 'inno-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: CheckboxComponent }],
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
export class CheckboxComponent extends _InnoCheckboxMixinBase
  implements
    OnInit,
    ControlValueAccessor,
    OnDestroy,
    MatFormFieldControl<any>,
    CanUpdateErrorState,
    CanDisable,
    DoCheck {
  static nextId = 0;
  form: FormGroup;

  _onChange: (value: any) => void = () => {};
  _onTouched = () => {};

  get focused(): boolean {
    return this._focused;
  }
  private _focused = false;

  controlType = 'inno-checkbox';

  private _uid = `inno-checkbox-${CheckboxComponent.nextId++}`;

  get empty() {
    return !this.form.get('checkbox').value;
  }

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  /** Whether the component is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required: boolean = false;

  @Input()
  get value(): any {
    const {
      value: { checkbox },
    } = this.form;
    return checkbox;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      this.form.setValue({ checkbox: newValue });
      this._onChange(newValue);
      this._value = newValue;
      this.stateChanges.next();
    }
  }

  private _value: any = false;

  _ariaDescribedby: string;
  @Input('aria-label') ariaLabel: string = '';
  @Input('aria-labelledby') ariaLabelledby: string;
  @Input() errorStateMatcher: ErrorStateMatcher;

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    fb: FormBuilder,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    elementRef: ElementRef,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() private _parentFormField: MatFormField,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super(
      elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );

    this.form = fb.group({
      checkbox: null,
    });

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex) || 0;
    this.id = this.id;
  }

  onUpdate(change: MatCheckboxChange) {
    this.value = change.checked;
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  _getAriaLabel(): string | null {
    // If an ariaLabelledby value has been set by the consumer, the checkbox should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
  }

  /** Returns the aria-labelledby of the checkbox component. */
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

  /**
   * Sets the checkbox's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Saves a callback function to be invoked when the checkbox's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the checkbox is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Disables the checkbox. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    // this.focus();
    // this.open();
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return true;
  }

  ngOnInit() {}
}

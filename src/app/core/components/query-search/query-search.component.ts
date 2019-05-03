// tslint:disable

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  CanDisableRipple,
  CanDisableRippleCtor,
  MAT_OPTION_PARENT_COMPONENT,
  MatOptgroup,
  MatOption,
  mixinDisableRipple
} from '@angular/material/core';

let _uniqueSearchQueryIdCounter = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class QuerySearchSelectedEvent {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: QuerySearchComponent,
    /** Option that was selected. */
    public option: MatOption
  ) {}
}

@Component({
  selector: 'etf-query-search',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'etfQuerySearch',
  inputs: ['disableRipple'],
  host: {
    class: 'etf-query-search'
  },
  providers: [
    { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: QuerySearchComponent }
  ],
  templateUrl: './query-search.html',
  styleUrls: ['./query-search.scss']
})
export class QuerySearchComponent implements AfterContentInit {
  _keyManager: ActiveDescendantKeyManager<MatOption>;
  showPanel = false;
  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }
  _isOpen = false;
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ViewChild('panel') panel: ElementRef;
  @ContentChildren(MatOption, { descendants: true }) options: QueryList<
    MatOption
  >;
  @ContentChildren(MatOptgroup) optionGroups: QueryList<MatOptgroup>;
  @Input() displayWith: ((value: any) => string) | null = null;
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;
  @Input() panelWidth: string | number;
  @Output() readonly optionSelected: EventEmitter<
    QuerySearchSelectedEvent
  > = new EventEmitter<QuerySearchSelectedEvent>();
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      value
        .split(' ')
        .forEach(className => (this._classList[className.trim()] = true));
      this._elementRef.nativeElement.className = '';
    }
  }
  _classList: { [key: string]: boolean } = {};
  id = `query-search-${_uniqueSearchQueryIdCounter++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<MatOption>(
      this.options
    ).withWrap();
    // Set the initial visibility state.
    this._setVisibility();
  }

  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  _setVisibility() {
    this.showPanel = !!this.options.length;
    this._classList['query-search-visible'] = this.showPanel;
    this._classList['query-search-hidden'] = !this.showPanel;
    this._changeDetectorRef.markForCheck();
  }

  _emitSelectEvent(option: MatOption): void {
    const event = new QuerySearchSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}

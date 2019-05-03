// tslint:disable

import { Directionality } from '@angular/cdk/bidi';
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  TAB,
  UP_ARROW
} from '@angular/cdk/keycodes';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { filter, take, switchMap, delay, tap, map } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  ViewContainerRef
} from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  MatOption,
  MatOptionSelectionChange
} from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import {
  Subscription,
  defer,
  fromEvent,
  merge,
  of as observableOf,
  Subject,
  Observable
} from 'rxjs';
import { QuerySearchComponent } from './query-search.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SearchQueryOrigin } from './query-search-origin';

export const SEARCH_QUERY_OPTION_HEIGHT = 48;
export const SEARCH_QUERY_PANEL_HEIGHT = 256;
export const SEARCH_QUERY_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>('search-query-scroll-strategy');
export function SEARCH_QUERY_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

export const SEARCH_QUERY_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SEARCH_QUERY_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SEARCH_QUERY_SCROLL_STRATEGY_FACTORY
};

export const SEARCH_QUERY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchQueryTrigger),
  multi: true
};

export function getSearchQueryMissingPanelError(): Error {
  return Error(
    'Attempting to open an undefined instance of `mat-search query`. ' +
      'Make sure that the id passed to the `SearchQuery` is correct and that ' +
      `you're attempting to open it after the ngAfterContentInit hook.`
  );
}

@Directive({
  selector: `input[etfQuerySearch], textarea[etfQuerySearch]`,
  host: {
    '[attr.autocomplete]': 'autocompleteAttribute',
    '[attr.role]': 'autocompleteDisabled ? null : "combobox"',
    '[attr.aria-autocomplete]': 'autocompleteDisabled ? null : "list"',
    '[attr.aria-activedescendant]': 'activeOption?.id',
    '[attr.aria-expanded]':
      'autocompleteDisabled ? null : panelOpen.toString()',
    '[attr.aria-owns]':
      '(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id',
    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
    // a little earlier. This avoids issues where IE delays the focusing of the input.
    '(focusin)': '_handleFocus()',
    '(blur)': '_onTouched()',
    '(input)': '_handleInput($event)',
    '(keydown)': '_handleKeydown($event)'
  },
  exportAs: 'etfQuerySearchTrigger',
  providers: [SEARCH_QUERY_VALUE_ACCESSOR]
})
export class SearchQueryTrigger implements ControlValueAccessor, OnDestroy {
  @Input('etfQuerySearch') searchQuery: QuerySearchComponent;
  @Input('etfQuerySearchConnectedTo') connectedTo: SearchQueryOrigin;
  @Input('autocomplete') autocompleteAttribute = 'off';

  @Input('previousValues') previousValues: any[];

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _componentDestroyed = false;
  private _searchQueryDisabled = false;
  private _scrollStrategy: () => ScrollStrategy;
  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private _previousValue: string | number | null;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  /** Whether or not the label state is being overridden. */
  private _manuallyFloatingLabel = false;

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription: Subscription;

  /** Subscription to viewport size changes. */
  private _viewportSubscription = Subscription.EMPTY;
  private _canOpenOnNextFocus = true;

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();

  /** The search query panel to be attached to this trigger. */

  @Input('matSearchQueryDisabled')
  get searchQueryDisabled(): boolean {
    return this._searchQueryDisabled;
  }
  set searchQueryDisabled(value: boolean) {
    this._searchQueryDisabled = coerceBooleanProperty(value);
  }
  private _overlayAttached = false;

  private _windowBlurHandler = () => {
    // If the user blurred the window while the search query is focused, it means that it'll be
    // refocused when they come back. In this case we want to skip the first focus event, if the
    // pane was closed, in order to avoid reopening it unintentionally.
    this._canOpenOnNextFocus =
      document.activeElement !== this._element.nativeElement || this.panelOpen;
  };

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when search query has been touched` */
  _onTouched = () => {};

  constructor(
    private _element: ElementRef<HTMLInputElement>,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(SEARCH_QUERY_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() private _dir: Directionality,
    @Optional() @Host() private _formField: MatFormField,
    @Optional() @Inject(DOCUMENT) private _document: any,
    // @breaking-change 8.0.0 Make `_viewportRuler` required.
    private _viewportRuler?: ViewportRuler
  ) {
    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        window.addEventListener('blur', this._windowBlurHandler);
      });
    }

    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this._windowBlurHandler);
    }

    this._viewportSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /** Whether or not the search query panel is open. */
  get panelOpen(): boolean {
    return this._overlayAttached && this.searchQuery.showPanel;
  }

  /** Opens the search query suggestion panel. */
  openPanel(): void {
    this._attachOverlay();
    this._floatLabel();
  }

  /** Closes the search query suggestion panel. */
  closePanel(): void {
    this._resetLabel();

    if (!this._overlayAttached) {
      return;
    }

    if (this.panelOpen) {
      // Only emit if the panel was visible.
      this.searchQuery.closed.emit();
    }

    this.searchQuery._isOpen = this._overlayAttached = false;

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._closingActionsSubscription.unsubscribe();
    }

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this._componentDestroyed) {
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this._changeDetectorRef.detectChanges();
    }
  }
  /**
   * Updates the position of the search query suggestion panel to ensure that it fits all options
   * within the viewport.
   */
  updatePosition(): void {
    if (this._overlayAttached) {
      this._overlayRef!.updatePosition();
    }
  }

  /**
   * A stream of actions that should close the search query panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<MatOptionSelectionChange | null> {
    return merge(
      this.optionSelections,
      this.searchQuery._keyManager.tabOut.pipe(
        filter(() => this._overlayAttached)
      ),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(filter(() => this._overlayAttached))
        : observableOf()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => (event instanceof MatOptionSelectionChange ? event : null))
    );
  }

  /** Stream of search query option selections. */
  readonly optionSelections: Observable<MatOptionSelectionChange> = defer(
    () => {
      if (this.searchQuery && this.searchQuery.options) {
        return merge(
          ...this.searchQuery.options.map(option => option.onSelectionChange)
        );
      }

      // If there are any subscribers before `ngAfterViewInit`, the `search query` will be undefined.
      // Return a stream that we'll replace with the real one once everything is in place.
      return this._zone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelections)
      );
    }
  );

  /** The currently active option, coerced to MatOption type. */
  get activeOption(): MatOption | null {
    if (this.searchQuery && this.searchQuery._keyManager) {
      return this.searchQuery._keyManager.activeItem;
    }

    return null;
  }

  /** Stream of clicks outside of the search query panel. */
  private _getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    ).pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        const formField = this._formField
          ? this._formField._elementRef.nativeElement
          : null;

        return (
          this._overlayAttached &&
          clickTarget !== this._element.nativeElement &&
          (!formField || !formField.contains(clickTarget)) &&
          (!!this._overlayRef &&
            !this._overlayRef.overlayElement.contains(clickTarget))
        );
      })
    );
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    Promise.resolve(null).then(() => this._setTriggerValue(value));
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this._element.nativeElement.disabled = isDisabled;
  }

  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    // Prevent the default action on all escape key presses. This is here primarily to bring IE
    // in line with other browsers. By default, pressing escape on IE will cause it to revert
    // the input value to the one that it had on focus, however it won't dispatch any events
    // which means that the model value will be out of sync with the view.
    if (keyCode === ESCAPE) {
      event.preventDefault();
    }

    if (this.activeOption && keyCode === ENTER && this.panelOpen) {
      this.activeOption._selectViaInteraction();
      this._resetActiveItem();
      event.preventDefault();
    } else if (this.searchQuery) {
      const prevActiveItem = this.searchQuery._keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

      if (this.panelOpen || keyCode === TAB) {
        this.searchQuery._keyManager.onKeydown(event);
      } else if (isArrowKey && this._canOpen()) {
        this.openPanel();
      }

      if (
        isArrowKey ||
        this.searchQuery._keyManager.activeItem !== prevActiveItem
      ) {
        this._scrollToOption();
      }
    }
  }

  _handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let value: number | string | null = target.value;

    // Based on `NumberValueAccessor` from forms.
    if (target.type === 'number') {
      value = value == '' ? null : parseFloat(value);
    }

    // If the input has a placeholder, IE will fire the `input` event on page load,
    // focus and blur, in addition to when the user actually changed the value. To
    // filter out all of the extra events, we save the value on focus and between
    // `input` events, and we check whether it changed.
    // See: https://connect.microsoft.com/IE/feedback/details/885747/
    if (this._previousValue !== value) {
      this._previousValue = value;
      this._onChange(value);

      if (this._canOpen() && document.activeElement === event.target) {
        this.openPanel();
      }
    }
  }

  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this._previousValue = this._element.nativeElement.value;
      this._attachOverlay();
      this._floatLabel(true);
    }
  }

  /**
   * In "auto" mode, the label will animate down as soon as focus is lost.
   * This causes the value to jump when selecting an option with the mouse.
   * This method manually floats the label until the panel can be closed.
   * @param shouldAnimate Whether the label should be animated when it is floated.
   */
  private _floatLabel(shouldAnimate = false): void {
    if (this._formField && this._formField.floatLabel === 'auto') {
      if (shouldAnimate) {
        this._formField._animateAndLockLabel();
      } else {
        this._formField.floatLabel = 'always';
      }

      this._manuallyFloatingLabel = true;
    }
  }

  /** If the label has been manually elevated, return it to its normal state. */
  private _resetLabel(): void {
    if (this._manuallyFloatingLabel) {
      this._formField.floatLabel = 'auto';
      this._manuallyFloatingLabel = false;
    }
  }

  /**
   * Given that we are not actually focusing active options, we must manually adjust scroll
   * to reveal options below the fold. First, we find the offset of the option from the top
   * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
   * the panel height + the option height, so the active option will be just visible at the
   * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
   * will become the offset. If that offset is visible within the panel already, the scrollTop is
   * not adjusted.
   */
  private _scrollToOption(): void {
    const index = this.searchQuery._keyManager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(
      index,
      this.searchQuery.options,
      this.searchQuery.optionGroups
    );

    const newScrollPosition = _getOptionScrollPosition(
      index + labelCount,
      SEARCH_QUERY_OPTION_HEIGHT,
      this.searchQuery._getScrollTop(),
      SEARCH_QUERY_PANEL_HEIGHT
    );

    this.searchQuery._setScrollTop(newScrollPosition);
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    const firstStable = this._zone.onStable.asObservable().pipe(take(1));
    const optionChanges = this.searchQuery.options.changes.pipe(
      tap(() => this._positionStrategy.reapplyLastPosition()),
      // Defer emitting to the stream until the next tick, because changing
      // bindings in here will cause "changed after checked" errors.
      delay(0)
    );

    // When the zone is stable initially, and when the option list changes...
    return (
      merge(firstStable, optionChanges)
        .pipe(
          // create a new stream of panelClosingActions, replacing any previous streams
          // that were created, and flatten it so our stream only emits closing events...
          switchMap(() => {
            this._resetActiveItem();
            this.searchQuery._setVisibility();

            if (this.panelOpen) {
              this._overlayRef!.updatePosition();
            }

            return this.panelClosingActions;
          }),
          // when the first closing event occurs...
          take(1)
        )
        // set the value, close the panel, and complete.
        .subscribe(event => this._setValueAndClose(event))
    );
  }

  /** Destroys the search query suggestion panel. */
  private _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _setTriggerValue(value: any): string {
    const toDisplay =
      this.searchQuery && this.searchQuery.displayWith
        ? this.searchQuery.displayWith(value)
        : value;

    // Simply falling back to an empty string if the display value is falsy does not work properly.
    // The display value can also be the number zero and shouldn't fall back to an empty string.
    const inputValue = toDisplay != null ? toDisplay : '';

    if (!this._previousValue) {
      this._previousValue = '';
    }


    const newValue = this._checkAndAddSpace(this._previousValue) + this._checkSpacesAddQuotes(inputValue);
    // If it's used within a `MatFormField`, we should set it through the property so it can go
    // through change detection.
    if (this._formField) {
      this._formField._control.value = newValue;
    } else {
      this._element.nativeElement.value = newValue;
    }

    this._previousValue = newValue;

    return newValue;
  }

  private _checkSpacesAddQuotes(value: string | number){
    if (typeof value === 'number') {
      value = value.toString();
    }

    if (value.indexOf(' ') >= 0) {
      return `"${value}"`;
    }

    return value;

  }

  private _checkAndAddSpace(value: string | number) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (value.length === 0) {
      return '';
    }
    if (
      value.charAt(value.length - 2) === ' ' &&
      value.charAt(value.length - 1) === ' '
    ) {
      return value.trim() + ' ';
    }
    if (value.charAt(value.length - 1) !== ' ') {
      return value + ' ';
    }

    return value;
  }

  /**
   * This method closes the panel, and if a value is specified, also sets the associated
   * control to that value. It will also mark the control as dirty if this interaction
   * stemmed from the user.
   */
  private _setValueAndClose(event: MatOptionSelectionChange | null): void {
    if (event && event.source) {
      this._clearPreviousSelectedOption(event.source);
      const val = this._setTriggerValue(event.source.value);
      this._onChange(val);
      this._element.nativeElement.focus();
      this.searchQuery._emitSelectEvent(event.source);
    }

    this.closePanel();
  }

  /**
   * Clear any previous selected option and emit a selection change event for this option
   */
  private _clearPreviousSelectedOption(skip: MatOption) {
    this.searchQuery.options.forEach(option => {
      option.deselect();
    });
  }

  private _attachOverlay(): void {
    if (!this.searchQuery) {
      throw getSearchQueryMissingPanelError();
    }

    if (!this._overlayRef) {
      this._portal = new TemplatePortal(
        this.searchQuery.template,
        this._viewContainerRef
      );
      this._overlayRef = this._overlay.create(this._getOverlayConfig());

      // Use the `keydownEvents` in order to take advantage of
      // the overlay event targeting provided by the CDK overlay.
      this._overlayRef.keydownEvents().subscribe(event => {
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (
          event.keyCode === ESCAPE ||
          (event.keyCode === UP_ARROW && event.altKey)
        ) {
          this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });

      if (this._viewportRuler) {
        this._viewportSubscription = this._viewportRuler
          .change()
          .subscribe(() => {
            if (this.panelOpen && this._overlayRef) {
              this._overlayRef.updateSize({ width: this._getPanelWidth() });
            }
          });
      }
    } else {
      // Update the panel width and direction, in case anything has changed.
      this._overlayRef.updateSize({ width: this._getPanelWidth() });
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    const wasOpen = this.panelOpen;

    this.searchQuery._setVisibility();
    this.searchQuery._isOpen = this._overlayAttached = true;

    // We need to do an extra `panelOpen` check in here, because the
    // search query won't be shown if there are no options.
    if (this.panelOpen && wasOpen !== this.panelOpen) {
      this.searchQuery.opened.emit();
    }
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._scrollStrategy(),
      width: this._getPanelWidth(),
      direction: this._dir
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._getConnectedElement())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',

          // The overlay edge connected to the trigger should have squared corners, while
          // the opposite end has rounded corners. We apply a CSS class to swap the
          // border-radius based on the overlay position.
          panelClass: 'search query-panel-above'
        }
      ]);

    return this._positionStrategy;
  }

  private _getConnectedElement(): ElementRef {
    if (this.connectedTo) {
      return this.connectedTo.elementRef;
    }

    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._element;
  }

  private _getPanelWidth(): number | string {
    return this.searchQuery.panelWidth || this._getHostWidth();
  }

  /** Returns the width of the input element, so the panel width can match it. */
  private _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect()
      .width;
  }

  /**
   * Resets the active item to -1 so arrow events will activate the
   * correct options, or to 0 if the consumer opted into it.
   */
  private _resetActiveItem(): void {
    this.searchQuery._keyManager.setActiveItem(
      this.searchQuery.autoActiveFirstOption ? 0 : -1
    );
  }

  /** Determines whether the panel can be opened. */
  private _canOpen(): boolean {
    const element = this._element.nativeElement;
    return !element.readOnly && !element.disabled && !this._searchQueryDisabled;
  }
}

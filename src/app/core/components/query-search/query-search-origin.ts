
import {Directive, ElementRef} from '@angular/core';

/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
@Directive({
  selector: '[etfSearchQueryOrigin]',
  exportAs: 'etfSearchQueryOrigin',
})
// tslint:disable-next-line:directive-class-suffix
export class SearchQueryOrigin {
  constructor(
      /** Reference to the element on which the directive is applied. */
      public elementRef: ElementRef<HTMLElement>) { }
}

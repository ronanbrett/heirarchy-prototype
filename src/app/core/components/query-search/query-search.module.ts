import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatOptionModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { QuerySearchFieldComponent } from './query-search-field.component';
import { SearchQueryOrigin } from './query-search-origin';
import { SearchQueryTrigger, SEARCH_QUERY_SCROLL_STRATEGY_FACTORY_PROVIDER } from './query-search-trigger';
import { QuerySearchComponent } from './query-search.component';

@NgModule({
  declarations: [
    QuerySearchFieldComponent,
    QuerySearchComponent,
    SearchQueryOrigin,
    SearchQueryTrigger,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    OverlayModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [
    QuerySearchComponent,
    MatOptionModule,
    SearchQueryTrigger,
    OverlayModule,
    QuerySearchFieldComponent
  ],
  providers: [SEARCH_QUERY_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class QuerySearchModule {}

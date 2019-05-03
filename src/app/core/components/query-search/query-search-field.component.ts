import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { QueryToken, SyntaxKind } from '../lexer/scanner.interfaces';
import { ScannerService } from '../lexer/scanner.service';
import { DEFAULT_FIELDS } from './query-search.consts';

const GRAMMAR_TREE = {
  array: ['contains', 'does not contain'],
  string: ['is', 'is not', 'starts with', 'ends with'],
  number: ['is greater than', 'is less than', 'is equal to', 'is not equal to'],
  links: ['and', 'or', 'not'],
  status: ['On Time', 'Slipping', 'Late'],
  categories: ['Fund Name', 'Fund Type', 'Stage', 'Status', 'Ticker']
};

@Component({
  selector: 'app-query-search-field',
  templateUrl: './query-search-field.component.html',
  styleUrls: ['./query-search-field.component.scss']
})
export class QuerySearchFieldComponent implements OnInit {
  control: FormControl = new FormControl();

  isValidQuery = false;
  tree: any;
  isManualEntry = false;
  @Output() match: EventEmitter<string> = new EventEmitter();
  @Output() reset: EventEmitter<string> = new EventEmitter();

  options: BehaviorSubject<any> = new BehaviorSubject([]);
  @Input() fields = DEFAULT_FIELDS;
  get mappedFields() {
    return this.fields.map(x => x.name);
  }

  @Input() links = GRAMMAR_TREE.links;

  @Output() results: EventEmitter<any> = new EventEmitter();

  filters: any[] = [];
  tags: any;

  constructor(private scanner: ScannerService) {}

  ngOnInit() {
    this.options.next(this.mappedFields);
    this.scanner.addTokens(this.fields);
    this.control.valueChanges.subscribe((n: string) => {
      this.scanner.setText(n);
      const tokens = this.scanner.getTokens();

      const lastToken = tokens[tokens.length - 1];

      if (!lastToken) {
        return this.options.next(this.mappedFields);
      }

      this.isValidQuery = this.checkEntries(tokens);

      if (lastToken && !n.endsWith(' ')) {
        return this.options.next([]);
      }

      if (this.isLastLinkToken(lastToken)) {
        return this.options.next(this.mappedFields);
      }

      if (this.isLastIdentifierToken(lastToken)) {
        return this.options.next(this.links);
      }

      if (this.isLastQueryToken(lastToken)) {
        const operators = this.getQueryTokenOperators(lastToken);
        return this.options.next(operators);
      }

      if (this.isLastOperatorToken(lastToken)) {
        const id = this.getLastIdentified(tokens);
        return this.options.next(this.getQueryTokenOptions(id) || []);
      }
    });
  }

  isLastLinkToken(token: QueryToken) {
    return token.currentToken === SyntaxKind.LinkToken;
  }

  isLastQueryToken(token: QueryToken) {
    return token.currentToken === SyntaxKind.QueryToken;
  }

  isLastOperatorToken(token: QueryToken) {
    return token.currentToken === SyntaxKind.OperatorToken;
  }

  isLastIdentifierToken(token: QueryToken) {
    return (
      token.currentToken === SyntaxKind.Identifier ||
      token.currentToken === SyntaxKind.StringLiteral
    );
  }

  getLastIdentified(tokens: QueryToken[]) {
    return [...tokens].reverse().find(x => x.tokenString === 'QueryToken');
  }

  getQueryTokenOperators(token: QueryToken) {
    const field = this.fields.find(
      x => x.name.toLowerCase() === token.tokenVal.toLowerCase()
    );
    return field.operators;
  }

  getQueryTokenOptions(token: QueryToken) {
    const field = this.fields.find(
      x => x.name.toLowerCase() === token.tokenVal.toLowerCase()
    );
    return field.options;
  }

  checkEntries(tokens: QueryToken[]) {
    let isValid = true;

    if (!tokens.length) {
      return false;
    }

    // Last Token should be an Identifier
    if (tokens[tokens.length - 1].currentToken !== SyntaxKind.Identifier) {
      isValid = false;
    }

    const tokensReversed = [...tokens];

    tokensReversed.reverse().forEach((token: QueryToken, i: number) => {
      const nextToken = tokensReversed[i + 1];
      const isLastToken = !nextToken;

      if (isLastToken) {
        return;
      }

      switch (token.currentToken) {
        case SyntaxKind.Identifier:
          if (nextToken.currentToken !== SyntaxKind.OperatorToken) {
            isValid = false;
          }
          return;
        case SyntaxKind.OperatorToken:
          if (nextToken.currentToken !== SyntaxKind.QueryToken) {
            isValid = false;
          }
          return;
        case SyntaxKind.QueryToken:
          if (nextToken && nextToken.currentToken !== SyntaxKind.LinkToken) {
            isValid = false;
          }
          return;
      }
    });

    this.processTokens(tokens);

    return isValid;
  }

  processTokens(tokens) {
    const items = {};
    let count = 0;
    let currentId = null;
    let currentOperator = null;

    tokens.forEach(element => {
      switch (count) {
        case 0:
          currentId = element.tokenVal;
          return count++;
        case 1:
          currentOperator = element.tokenVal;
          return count++;
        case 2:
          items[currentId] = items[currentId]
            ? [...items[currentId], element.tokenVal]
            : [element.tokenVal];
          return count++;
        default:
          count = 0;
      }
    });
    console.log(items);
  }

  displayFn(val): string | undefined {
    return val ? val : undefined;
  }

  selectOption() {}
}

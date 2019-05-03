import { SyntaxKind } from '../lexer/scanner.interfaces';

export const QueryFieldSyntaxKind = {};
export enum QueryFieldType {
  Fund = 'Fund',
  FundGroup = 'FundGroup'
}
export type QueryOperators =
  | SyntaxKind.EqualsToken
  | SyntaxKind.ExclamationEqualsToken
  | SyntaxKind.InKeywordToken;

export interface QueryField {
  name: string;
  type: SyntaxKind;
  operators: string[];
  options?: string[];
}

export const DEFAULT_FIELDS: QueryField[] = [
  {
    name: 'fund',
    type: SyntaxKind.QueryToken,
    operators: ['=', '!=']
  },
  {
    name: 'fundGroup',
    type: SyntaxKind.QueryToken,
    operators: ['=', '!=']
  },
  {
    name: 'documentType',
    type: SyntaxKind.QueryToken,
    operators: ['=', '!='],
    options: ['AFS', 'K1 Tax Documents']
  }
];

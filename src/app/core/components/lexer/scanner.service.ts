// tslint:disable:no-bitwise

import { Injectable } from '@angular/core';
import {
  SyntaxKind,
  CharacterCodes,
  TokenFlags,
  KeywordSyntaxKind,
  QueryToken
} from './scanner.interfaces';
import {
  formatSyntaxKind,
  isIdentifierStart,
  isIdentifierPart,
  isDigit,
  parsePseudoBigInt,
  isOctalDigit,
  isLineBreak,
  createMapFromTemplate
} from './scanner.utilts';
import { MapLike } from 'typescript';
import { QueryField } from '../query-search/query-search.consts';

const textToKeywordObj: MapLike<KeywordSyntaxKind> = {
  in: SyntaxKind.InKeywordToken,
  and: SyntaxKind.LinkToken,
  not: SyntaxKind.LinkToken,
  or: SyntaxKind.LinkToken
};

const textToKeyword = createMapFromTemplate(textToKeywordObj);

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private text: string;
  private pos: number;
  private end: number;

  private startPos: number;
  private endPos: number;

  private token: any;
  private tokenPos: any;
  private tokenValue: any;
  private tokenFlags: any;

  tokens: QueryToken[] = [];
  textToToken = createMapFromTemplate({
    ...textToKeywordObj
  });

  setText(text: string) {
    this.tokens = [];
    this.text = text.trim();
    this.startPos = 0;
    this.pos = this.tokenPos = 0;
    this.end = this.text.length;
  }

  addTokens(tokens: QueryField[]) {
    const tok = tokens.reduce((accum, x) => {
      return Object.assign(accum, { [x.name]: x.type });
    }, {});

    this.textToToken = createMapFromTemplate({
      ...textToKeywordObj,
      ...tok
    });
  }

  getTokens(): QueryToken[] {
    let token = this.scan();
    while (token !== SyntaxKind.EndOfFileToken) {
      const currentToken = token;
      const tokenString = formatSyntaxKind(token);
      const tokenVal = this.tokenValue;
      const tokenStart = this.startPos;
      token = this.scan();
      const tokenEnd = this.startPos;
      this.tokens.push({ currentToken, tokenString, tokenVal, tokenStart, tokenEnd });
    }

    return this.tokens;
  }

  private scanIdentifierParts(): string {
    let result = '';
    const start = this.pos;
    while (this.pos < this.end) {
      const ch = this.text.charCodeAt(this.pos);
      if (isIdentifierPart(ch)) {
        this.pos++;
      } else {
        break;
      }
    }
    result += this.text.substring(start, this.pos);
    return result;
  }

  scanString(jsxAttributeString = false): string {
    const quote = this.text.charCodeAt(this.pos);
    this.pos++;
    let result = '';
    let start = this.pos;
    while (true) {
      if (this.pos >= this.end) {
        result += this.text.substring(start, this.pos);
        this.tokenFlags |= TokenFlags.Unterminated;
        // throw new Error(`Diagnostics.Unterminated_string_literal`);
        break;
      }
      const ch = this.text.charCodeAt(this.pos);
      if (ch === quote) {
        result += this.text.substring(start, this.pos);
        this.pos++;
        break;
      }
      if (ch === CharacterCodes.backslash && !jsxAttributeString) {
        result += this.text.substring(start, this.pos);
        result += this.scanEscapeSequence();
        start = this.pos;
        continue;
      }
      if (isLineBreak(ch) && !jsxAttributeString) {
        result += this.text.substring(start, this.pos);
        this.tokenFlags |= TokenFlags.Unterminated;
        throw new Error(`Diagnostics.Unterminated_string_literal`);
        break;
      }
      this.pos++;
    }
    return result;
  }

  scanEscapeSequence(): string {
    this.pos++;
    if (this.pos >= this.end) {
      return '';
      throw new Error(`Diagnostics.Unexpected_end_of_text`);
    }
    const ch = this.text.charCodeAt(this.pos);
    this.pos++;
    switch (ch) {
      case CharacterCodes._0:
        return '\0';
      case CharacterCodes.b:
        return '\b';
      case CharacterCodes.t:
        return '\t';
      case CharacterCodes.n:
        return '\n';
      case CharacterCodes.v:
        return '\v';
      case CharacterCodes.f:
        return '\f';
      case CharacterCodes.r:
        return '\r';
      case CharacterCodes.singleQuote:
        return "'";
      case CharacterCodes.doubleQuote:
        return '"';
      case CharacterCodes.u:
        // '\u{DDDDDDDD}'
        if (
          this.pos < this.end &&
          this.text.charCodeAt(this.pos) === CharacterCodes.openBrace
        ) {
          this.tokenFlags |= TokenFlags.ExtendedUnicodeEscape;
          this.pos++;
          return this.scanExtendedUnicodeEscape();
        }

        // '\uDDDD'
        return this.scanHexadecimalEscape(/*numDigits*/ 4);

      case CharacterCodes.x:
        // '\xDD'
        return this.scanHexadecimalEscape(/*numDigits*/ 2);

      // when encountering a LineContinuation (i.e. a backslash and a line terminator sequence),
      // the line terminator is interpreted to be "the empty code unit sequence".
      case CharacterCodes.carriageReturn:
        if (
          this.pos < this.end &&
          this.text.charCodeAt(this.pos) === CharacterCodes.lineFeed
        ) {
          this.pos++;
        }
      // falls through
      case CharacterCodes.lineFeed:
      case CharacterCodes.lineSeparator:
      case CharacterCodes.paragraphSeparator:
        return '';
      default:
        return String.fromCharCode(ch);
    }
  }

  scanHexadecimalEscape(numDigits: number): string {
    const escapedValue = this.scanExactNumberOfHexDigits(
      numDigits,
      /*canHaveSeparators*/ false
    );

    if (escapedValue >= 0) {
      return String.fromCharCode(escapedValue);
    } else {
      throw new Error(`Diagnostics.Hexadecimal_digit_expected`);
      return '';
    }
  }

  private scanExactNumberOfHexDigits(
    count: number,
    canHaveSeparators: boolean
  ): number {
    const valueString = this.scanHexDigits(
      /*minCount*/ count,
      /*scanAsManyAsPossible*/ false,
      canHaveSeparators
    );
    return valueString ? parseInt(valueString, 16) : -1;
  }

  private scanExtendedUnicodeEscape(): string {
    const escapedValueString = this.scanMinimumNumberOfHexDigits(
      1,
      /*canHaveSeparators*/ false
    );
    const escapedValue = escapedValueString
      ? parseInt(escapedValueString, 16)
      : -1;
    let isInvalidExtendedEscape = false;

    // Validate the value of the digit
    if (escapedValue < 0) {
      throw new Error(`Diagnostics.Hexadecimal_digit_expected`);
      isInvalidExtendedEscape = true;
    } else if (escapedValue > 0x10ffff) {
      isInvalidExtendedEscape = true;

      throw new Error(
        `Diagnostics.An_extended_Unicode_escape_value_must_be_between_0x0_and_0x10FFFF_inclusive`
      );
    }

    if (this.pos >= this.end) {
      isInvalidExtendedEscape = true;

      throw new Error(`Diagnostics.Unexpected_end_of_text`);
    } else if (this.text.charCodeAt(this.pos) === CharacterCodes.closeBrace) {
      // Only swallow the following character up if it's a '}'.
      this.pos++;
    } else {
      isInvalidExtendedEscape = true;

      throw new Error(`Diagnostics.Unterminated_Unicode_escape_sequence`);
    }

    if (isInvalidExtendedEscape) {
      return '';
    }

    return this.utf16EncodeAsString(escapedValue);
  }

  private utf16EncodeAsString(codePoint: number): string {
    // Debug.assert(0x0 <= codePoint && codePoint <= 0x10FFFF);

    if (codePoint <= 65535) {
      return String.fromCharCode(codePoint);
    }

    const codeUnit1 = Math.floor((codePoint - 65536) / 1024) + 0xd800;
    const codeUnit2 = ((codePoint - 65536) % 1024) + 0xdc00;

    return String.fromCharCode(codeUnit1, codeUnit2);
  }

  scanNumberFragment(): string {
    let start = this.pos;
    let allowSeparator = false;
    let isPreviousTokenSeparator = false;
    let result = '';
    while (true) {
      const ch = this.text.charCodeAt(this.pos);
      if (ch === CharacterCodes._) {
        this.tokenFlags |= TokenFlags.ContainsSeparator;
        if (allowSeparator) {
          allowSeparator = false;
          isPreviousTokenSeparator = true;
          result += this.text.substring(start, this.pos);
        } else if (isPreviousTokenSeparator) {
          throw new Error(
            'Multiple_consecutive_numeric_separators_are_not_permitted'
          );
        } else {
          throw new Error(
            'Diagnostics.Numeric_separators_are_not_allowed_here'
          );
        }
        this.pos++;
        start = this.pos;
        continue;
      }
      if (isDigit(ch)) {
        allowSeparator = true;
        isPreviousTokenSeparator = false;
        this.pos++;
        continue;
      }
      break;
    }
    if (this.text.charCodeAt(this.pos - 1) === CharacterCodes._) {
      throw new Error('Diagnostics.Numeric_separators_are_not_allowed_here');
    }
    return result + this.text.substring(start, this.pos);
  }

  private scanNumber(): { type: SyntaxKind; value: string } {
    const start = this.pos;
    const mainFragment = this.scanNumberFragment();
    let decimalFragment: string | undefined;
    let scientificFragment: string | undefined;
    if (this.text.charCodeAt(this.pos) === CharacterCodes.dot) {
      this.pos++;
      decimalFragment = this.scanNumberFragment();
    }
    let end = this.pos;
    if (
      this.text.charCodeAt(this.pos) === CharacterCodes.E ||
      this.text.charCodeAt(this.pos) === CharacterCodes.e
    ) {
      this.pos++;
      this.tokenFlags |= TokenFlags.Scientific;
      if (
        this.text.charCodeAt(this.pos) === CharacterCodes.plus ||
        this.text.charCodeAt(this.pos) === CharacterCodes.minus
      ) {
        this.pos++;
      }
      const preNumericPart = this.pos;
      const finalFragment = this.scanNumberFragment();
      if (!finalFragment) {
        throw new Error('Diagnostics.Digit_expected');
      } else {
        scientificFragment =
          this.text.substring(end, preNumericPart) + finalFragment;
        end = this.pos;
      }
    }
    let result: string;
    if (this.tokenFlags & TokenFlags.ContainsSeparator) {
      result = mainFragment;
      if (decimalFragment) {
        result += '.' + decimalFragment;
      }
      if (scientificFragment) {
        result += scientificFragment;
      }
    } else {
      result = this.text.substring(start, end); // No need to use all the fragments; no _ removal needed
    }

    if (
      decimalFragment !== undefined ||
      this.tokenFlags & TokenFlags.Scientific
    ) {
      this.checkForIdentifierStartAfterNumericLiteral(
        start,
        decimalFragment === undefined &&
          !!(this.tokenFlags & TokenFlags.Scientific)
      );
      return {
        type: SyntaxKind.OperatorToken,
        value: '' + +result // if value is not an integer, it can be safely coerced to a number
      };
    } else {
      this.tokenValue = result;
      const type = this.checkBigIntSuffix(); // if value is an integer, check whether it is a bigint
      this.checkForIdentifierStartAfterNumericLiteral(start);
      return { type, value: this.tokenValue };
    }
  }

  private scanBinaryOrOctalDigits(base: 2 | 8): string {
    let value = '';
    // For counting number of digits; Valid binaryIntegerLiteral must have at least one binary digit following B or b.
    // Similarly valid octalIntegerLiteral must have at least one octal digit following o or O.
    let separatorAllowed = false;
    let isPreviousTokenSeparator = false;
    while (true) {
      const ch = this.text.charCodeAt(this.pos);
      // Numeric separators are allowed anywhere within a numeric literal, except not at the beginning, or following another separator
      if (ch === CharacterCodes._) {
        this.tokenFlags |= TokenFlags.ContainsSeparator;
        if (separatorAllowed) {
          separatorAllowed = false;
          isPreviousTokenSeparator = true;
        } else if (isPreviousTokenSeparator) {
          throw new Error(
            'Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1'
          );
        } else {
          throw new Error(
            'Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1'
          );
        }
        this.pos++;
        continue;
      }
      separatorAllowed = true;
      if (!isDigit(ch) || ch - CharacterCodes._0 >= base) {
        break;
      }
      value += this.text[this.pos];
      this.pos++;
      isPreviousTokenSeparator = false;
    }
    if (this.text.charCodeAt(this.pos - 1) === CharacterCodes._) {
      // Literal ends with underscore - not allowed
      throw new Error(
        'Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1'
      );
    }
    return value;
  }

  private scanOctalDigits(): number {
    const start = this.pos;
    while (isOctalDigit(this.text.charCodeAt(this.pos))) {
      this.pos++;
    }
    return +this.text.substring(start, this.pos);
  }

  private scanMinimumNumberOfHexDigits(
    count: number,
    canHaveSeparators: boolean
  ): string {
    return this.scanHexDigits(
      /*minCount*/ count,
      /*scanAsManyAsPossible*/ true,
      canHaveSeparators
    );
  }

  private scanHexDigits(
    minCount: number,
    scanAsManyAsPossible: boolean,
    canHaveSeparators: boolean
  ): string {
    let valueChars: number[] = [];
    let allowSeparator = false;
    let isPreviousTokenSeparator = false;
    while (valueChars.length < minCount || scanAsManyAsPossible) {
      let ch = this.text.charCodeAt(this.pos);
      if (canHaveSeparators && ch === CharacterCodes._) {
        this.tokenFlags |= TokenFlags.ContainsSeparator;
        if (allowSeparator) {
          allowSeparator = false;
          isPreviousTokenSeparator = true;
        } else if (isPreviousTokenSeparator) {
          throw new Error(
            `Diagnostics.Multiple_consecutive_numeric_separators_are_not_permitted, pos, 1`
          );
        } else {
          throw new Error(
            `Diagnostics.Numeric_separators_are_not_allowed_here, pos, 1`
          );
        }
        this.pos++;
        continue;
      }
      allowSeparator = canHaveSeparators;
      if (ch >= CharacterCodes.A && ch <= CharacterCodes.F) {
        ch += CharacterCodes.a - CharacterCodes.A; // standardize hex literals to lowercase
      } else if (
        !(
          (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) ||
          (ch >= CharacterCodes.a && ch <= CharacterCodes.f)
        )
      ) {
        break;
      }
      valueChars.push(ch);
      this.pos++;
      isPreviousTokenSeparator = false;
    }
    if (valueChars.length < minCount) {
      valueChars = [];
    }
    if (this.text.charCodeAt(this.pos - 1) === CharacterCodes._) {
      throw new Error(
        `Diagnostics.Numeric_separators_are_not_allowed_here, pos - 1, 1`
      );
    }
    return String.fromCharCode(...valueChars);
  }

  private checkBigIntSuffix(): SyntaxKind {
    if (this.text.charCodeAt(this.pos) === CharacterCodes.n) {
      this.tokenValue += 'n';
      // Use base 10 instead of base 2 or base 8 for shorter literals
      if (this.tokenFlags & TokenFlags.BinaryOrOctalSpecifier) {
        this.tokenValue = parsePseudoBigInt(this.tokenValue) + 'n';
      }
      this.pos++;
      return SyntaxKind.Identifier;
    } else {
      // not a bigint, so can convert to number in simplified form
      // Number() may not support 0b or 0o, so use parseInt() instead
      const numericValue =
        this.tokenFlags & TokenFlags.BinarySpecifier
          ? parseInt(this.tokenValue.slice(2), 2) // skip "0b"
          : this.tokenFlags & TokenFlags.OctalSpecifier
          ? parseInt(this.tokenValue.slice(2), 8) // skip "0o"
          : +this.tokenValue;
      this.tokenValue = '' + numericValue;
      return SyntaxKind.Identifier;
    }
  }

  private checkForIdentifierStartAfterNumericLiteral(
    numericStart: number,
    isScientific?: boolean
  ) {
    if (!isIdentifierStart(this.text.charCodeAt(this.pos))) {
      return;
    }

    const identifierStart = this.pos;
    const { length } = this.scanIdentifierParts();

    if (length === 1 && this.text[identifierStart] === 'n') {
      if (isScientific) {
        throw new Error(
          'Diagnostics.A_bigint_literal_cannot_use_exponential_notation, numericStart, identifierStart - numericStart + 1'
        );
      } else {
        throw new Error(
          'Diagnostics.A_bigint_literal_must_be_an_integer, numericStart, identifierStart - numericStart + 1'
        );
      }
    } else {
      throw new Error(
        'Diagnostics.An_identifier_or_keyword_cannot_immediately_follow_a_numeric_literal, identifierStart, length'
      );
      this.pos = identifierStart;
    }
  }

  private scan() {
    this.startPos = this.pos;

    while (true) {
      this.tokenPos = this.pos;

      if (this.pos >= this.end) {
        return (this.token = SyntaxKind.EndOfFileToken);
      }

      let ch = this.text.charCodeAt(this.pos);
      this.tokenValue = null;

      switch (ch) {
        case CharacterCodes.question:
          this.pos++;
          return (this.token = SyntaxKind.QuestionToken);

        case CharacterCodes.tab:
        case CharacterCodes.verticalTab:
        case CharacterCodes.formFeed:
        case CharacterCodes.space:
        case CharacterCodes.nonBreakingSpace:
        case CharacterCodes.ogham:
        case CharacterCodes.enQuad:
        case CharacterCodes.emQuad:
        case CharacterCodes.enSpace:
        case CharacterCodes.emSpace:
        case CharacterCodes.threePerEmSpace:
        case CharacterCodes.fourPerEmSpace:
        case CharacterCodes.sixPerEmSpace:
        case CharacterCodes.figureSpace:
        case CharacterCodes.punctuationSpace:
        case CharacterCodes.thinSpace:
        case CharacterCodes.hairSpace:
        case CharacterCodes.zeroWidthSpace:
        case CharacterCodes.narrowNoBreakSpace:
        case CharacterCodes.mathematicalSpace:
        case CharacterCodes.ideographicSpace:
        case CharacterCodes.byteOrderMark:
          this.pos++;
          continue;

        case CharacterCodes.lessThan:
          if (this.text.charCodeAt(this.pos + 1) === CharacterCodes.lessThan) {
            if (this.text.charCodeAt(this.pos + 2) === CharacterCodes.equals) {
              // Less Than Less than Equals
              return (
                (this.pos += 3),
                (this.tokenValue = '<<='),
                (this.token = SyntaxKind.OperatorToken)
              );
            }
            // Less Than Less Than
            return (
              (this.tokenValue = '<<'),
              (this.pos += 2),
              (this.token = SyntaxKind.OperatorToken)
            );
          }
          // Less than Equals
          if (this.text.charCodeAt(this.pos + 1) === CharacterCodes.equals) {
            return (
              (this.pos += 2),
              (this.tokenValue = '<='),
              (this.token = SyntaxKind.OperatorToken)
            );
          }

          this.pos++;

          this.tokenValue = '<';
          return (this.token = SyntaxKind.OperatorToken);

        case CharacterCodes.equals:
          if (this.text.charCodeAt(this.pos + 1) === CharacterCodes.equals) {
            if (this.text.charCodeAt(this.pos + 2) === CharacterCodes.equals) {
              // Equals Equals Equals
              return (
                (this.pos += 3),
                (this.tokenValue = '==='),
                (this.token = SyntaxKind.OperatorToken)
              );
            }
            // Equals Equals
            return (
              (this.pos += 2),
              (this.tokenValue = '==='),
              (this.token = SyntaxKind.OperatorToken)
            );
          }
          if (
            this.text.charCodeAt(this.pos + 1) === CharacterCodes.greaterThan
          ) {
            // Equals Greater Than
            return (
              (this.pos += 2),
              (this.tokenValue = '=>'),
              (this.token = SyntaxKind.OperatorToken)
            );
          }
          this.pos++;

          /// Equals
          return (
            (this.tokenValue = '='), (this.token = SyntaxKind.OperatorToken)
          );

        case CharacterCodes.doubleQuote:
        case CharacterCodes.singleQuote:
          this.tokenValue = this.scanString();
          return (this.token = SyntaxKind.Identifier);

        case CharacterCodes._0:
          if (
            this.pos + 2 < this.end &&
            (this.text.charCodeAt(this.pos + 1) === CharacterCodes.X ||
              this.text.charCodeAt(this.pos + 1) === CharacterCodes.x)
          ) {
            this.pos += 2;
            this.tokenValue = this.scanMinimumNumberOfHexDigits(
              1,
              /*canHaveSeparators*/ true
            );
            if (!this.tokenValue) {
              throw new Error('Diagnostics.Hexadecimal_digit_expected');
              this.tokenValue = '0';
            }
            this.tokenValue = '0x' + this.tokenValue;
            this.tokenFlags |= TokenFlags.HexSpecifier;
            return (this.token = this.checkBigIntSuffix());
          } else if (
            this.pos + 2 < this.end &&
            (this.text.charCodeAt(this.pos + 1) === CharacterCodes.B ||
              this.text.charCodeAt(this.pos + 1) === CharacterCodes.b)
          ) {
            this.pos += 2;
            this.tokenValue = this.scanBinaryOrOctalDigits(/* base */ 2);
            if (!this.tokenValue) {
              throw new Error('Diagnostics.Binary_digit_expected');
              this.tokenValue = '0';
            }
            this.tokenValue = '0b' + this.tokenValue;
            this.tokenFlags |= TokenFlags.BinarySpecifier;
            return (this.token = this.checkBigIntSuffix());
          } else if (
            this.pos + 2 < this.end &&
            (this.text.charCodeAt(this.pos + 1) === CharacterCodes.O ||
              this.text.charCodeAt(this.pos + 1) === CharacterCodes.o)
          ) {
            this.pos += 2;
            this.tokenValue = this.scanBinaryOrOctalDigits(/* base */ 8);
            if (!this.tokenValue) {
              this.tokenValue = '0';
              throw new Error(`Diagnostics.Octal_digit_expected`);
            }
            this.tokenValue = '0o' + this.tokenValue;
            this.tokenFlags |= TokenFlags.OctalSpecifier;
            return (this.token = this.checkBigIntSuffix());
          }
          // Try to parse as an octal
          if (
            this.pos + 1 < this.end &&
            isOctalDigit(this.text.charCodeAt(this.pos + 1))
          ) {
            this.tokenValue = '' + this.scanOctalDigits();
            this.tokenFlags |= TokenFlags.Octal;
            return (this.token = SyntaxKind.OperatorToken);
          }
        // This fall-through is a deviation from the EcmaScript grammar. The grammar says that a leading zero
        // can only be followed by an octal digit, a dot, or the end of the number literal. However, we are being
        // permissive and allowing decimal digits of the form 08* and 09* (which many browsers also do).
        // falls through
        case CharacterCodes._1:
        case CharacterCodes._2:
        case CharacterCodes._3:
        case CharacterCodes._4:
        case CharacterCodes._5:
        case CharacterCodes._6:
        case CharacterCodes._7:
        case CharacterCodes._8:
        case CharacterCodes._9:
          ({ type: this.token, value: this.tokenValue } = this.scanNumber());
          return this.token;

        default:
          if (isIdentifierStart(ch)) {
            this.pos++;
            while (
              this.pos < this.end &&
              isIdentifierPart((ch = this.text.charCodeAt(this.pos)))
            ) {
              this.pos++;
            }
            this.tokenValue = this.text.substring(this.tokenPos, this.pos);
            if (ch === CharacterCodes.backslash) {
              this.tokenValue += this.scanIdentifierParts();
            }
            return (this.token = this.getIdentifierToken());
          }

          this.pos++;
          return (this.token = SyntaxKind.Unknown);
      }
    }
  }

  getIdentifierToken(): SyntaxKind.Identifier | any {
    // Reserved words are between 2 and 11 characters long and start with a lowercase letter
    const len = this.tokenValue.length;
    if (len >= 0 && len <= 20) {
      const ch = this.tokenValue.charCodeAt(0);
      if (ch >= CharacterCodes.a && ch <= CharacterCodes.z) {
        const keyword = this.textToToken.get(this.tokenValue);
        if (keyword !== undefined) {
          return (this.token = keyword);
        }
      }
    }
    return (this.token = SyntaxKind.Identifier);
  }
}

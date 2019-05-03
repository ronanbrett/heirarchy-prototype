// tslint:disable:no-bitwise

import { SyntaxKind, CharacterCodes } from './scanner.interfaces';

export function formatSyntaxKind(kind: SyntaxKind | undefined): string {
  switch (kind) {
    case SyntaxKind.Identifier:
      return 'Identifier';

    case SyntaxKind.QuestionToken:
      return 'QuestionToken';

    case SyntaxKind.NumericLiteral:
      return 'NumericLiteral';
    case SyntaxKind.BigIntLiteral:
      return 'BigIntLiteral';
    case SyntaxKind.StringLiteral:
      return 'StringLiteral';

    case SyntaxKind.EqualsEqualsEqualsToken:
      return 'EqualsEqualsEqualsToken';
    case SyntaxKind.EqualsEqualsToken:
      return 'EqualsEqualsToken';
    case SyntaxKind.EqualsToken:
      return 'EqualsToken';

    case SyntaxKind.LessThanLessThanEqualsToken:
      return 'LessThanLessThanEqualsToken';
    case SyntaxKind.LessThanLessThanToken:
      return 'LessThanLessThanToken';
    case SyntaxKind.LessThanEqualsToken:
      return 'LessThanEqualsToken';
    case SyntaxKind.LessThanToken:
      return 'LessThanToken';

    case SyntaxKind.EndOfFileToken:
      return 'EndOfFileToken';

    case SyntaxKind.InKeywordToken:
      return 'InKeywordToken';

    case SyntaxKind.QueryToken:
      return 'QueryToken';

    case SyntaxKind.LinkToken:
      return 'LinkToken';

    case SyntaxKind.OperatorToken:
      return 'OperatorToken';

    case SyntaxKind.EqualsGreaterThanToken:
    case SyntaxKind.Unknown:
    default:
      return 'Unknown';
  }
}

export function isIdentifierStart(ch: number): boolean {
  return (
    (ch >= CharacterCodes.A && ch <= CharacterCodes.Z) ||
    (ch >= CharacterCodes.a && ch <= CharacterCodes.z) ||
    ch === CharacterCodes.$ ||
    ch === CharacterCodes._
  );
}

export function isIdentifierPart(ch: number): boolean {
  return (
    (ch >= CharacterCodes.A && ch <= CharacterCodes.Z) ||
    (ch >= CharacterCodes.a && ch <= CharacterCodes.z) ||
    (ch >= CharacterCodes._0 && ch <= CharacterCodes._9) ||
    ch === CharacterCodes.$ ||
    ch === CharacterCodes._
  );
}

export function isWhiteSpaceLike(ch: number): boolean {
  return isWhiteSpaceSingleLine(ch) || isLineBreak(ch);
}

/** Does not include line breaks. For that, see isWhiteSpaceLike. */
export function isWhiteSpaceSingleLine(ch: number): boolean {
  // Note: nextLine is in the Zs space, and should be considered to be a whitespace.
  // It is explicitly not a line-break as it isn't in the exact set specified by EcmaScript.
  return (
    ch === CharacterCodes.space ||
    ch === CharacterCodes.tab ||
    ch === CharacterCodes.verticalTab ||
    ch === CharacterCodes.formFeed ||
    ch === CharacterCodes.nonBreakingSpace ||
    ch === CharacterCodes.nextLine ||
    ch === CharacterCodes.ogham ||
    (ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace) ||
    ch === CharacterCodes.narrowNoBreakSpace ||
    ch === CharacterCodes.mathematicalSpace ||
    ch === CharacterCodes.ideographicSpace ||
    ch === CharacterCodes.byteOrderMark
  );
}

export function isLineBreak(ch: number): boolean {
  // ES5 7.3:
  // The ECMAScript line terminator characters are listed in Table 3.
  //     Table 3: Line Terminator Characters
  //     Code Unit Value     Name                    Formal Name
  //     \u000A              Line Feed               <LF>
  //     \u000D              Carriage Return         <CR>
  //     \u2028              Line separator          <LS>
  //     \u2029              Paragraph separator     <PS>
  // Only the characters in Table 3 are treated as line terminators. Other new line or line
  // breaking characters are treated as white space but not as line terminators.

  return (
    ch === CharacterCodes.lineFeed ||
    ch === CharacterCodes.carriageReturn ||
    ch === CharacterCodes.lineSeparator ||
    ch === CharacterCodes.paragraphSeparator
  );
}

export function isDigit(ch: number): boolean {
  return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
}

/* @internal */
export function isOctalDigit(ch: number): boolean {
  return ch >= CharacterCodes._0 && ch <= CharacterCodes._7;
}

export function parsePseudoBigInt(stringValue: string): string {
  let log2Base: number;
  switch (
    stringValue.charCodeAt(1) // "x" in "0x123"
  ) {
    case CharacterCodes.b:
    case CharacterCodes.B: // 0b or 0B
      log2Base = 1;
      break;
    case CharacterCodes.o:
    case CharacterCodes.O: // 0o or 0O
      log2Base = 3;
      break;
    case CharacterCodes.x:
    case CharacterCodes.X: // 0x or 0X
      log2Base = 4;
      break;
    default:
      // already in decimal; omit trailing "n"
      const nIndex = stringValue.length - 1;
      // Skip leading 0s
      let nonZeroStart = 0;
      while (stringValue.charCodeAt(nonZeroStart) === CharacterCodes._0) {
        nonZeroStart++;
      }
      return stringValue.slice(nonZeroStart, nIndex) || '0';
  }

  // Omit leading "0b", "0o", or "0x", and trailing "n"
  const startIndex = 2,
    endIndex = stringValue.length - 1;
  const bitsNeeded = (endIndex - startIndex) * log2Base;
  // Stores the value specified by the string as a LE array of 16-bit integers
  // using Uint16 instead of Uint32 so combining steps can use bitwise operators
  const segments = new Uint16Array(
    (bitsNeeded >>> 4) + (bitsNeeded & 15 ? 1 : 0)
  );
  // Add the digits, one at a time
  for (
    let i = endIndex - 1, bitOffset = 0;
    i >= startIndex;
    i--, bitOffset += log2Base
  ) {
    const segment = bitOffset >>> 4;
    const digitChar = stringValue.charCodeAt(i);
    // Find character range: 0-9 < A-F < a-f
    const digit =
      digitChar <= CharacterCodes._9
        ? digitChar - CharacterCodes._0
        : 10 +
          digitChar -
          (digitChar <= CharacterCodes.F ? CharacterCodes.A : CharacterCodes.a);
    const shiftedDigit = digit << (bitOffset & 15);
    segments[segment] |= shiftedDigit;
    const residual = shiftedDigit >>> 16;
    if (residual) {
      segments[segment + 1] |= residual;
    } // overflows segment
  }
  // Repeatedly divide segments by 10 and add remainder to base10Value
  let base10Value = '';
  let firstNonzeroSegment = segments.length - 1;
  let segmentsRemaining = true;
  while (segmentsRemaining) {
    let mod10 = 0;
    segmentsRemaining = false;
    for (let segment = firstNonzeroSegment; segment >= 0; segment--) {
      const newSegment = (mod10 << 16) | segments[segment];
      const segmentValue = (newSegment / 10) | 0;
      segments[segment] = segmentValue;
      mod10 = newSegment - segmentValue * 10;
      if (segmentValue && !segmentsRemaining) {
        firstNonzeroSegment = segment;
        segmentsRemaining = true;
      }
    }
    base10Value = mod10 + base10Value;
  }
  return base10Value;
}

export function pseudoBigIntToString({ negative, base10Value }: any): string {
  return (negative && base10Value !== '0' ? '-' : '') + base10Value;
}

export function createMapFromTemplate(template: {}) {
  const map = new Map();

  for (const key in template) {
    if (template.hasOwnProperty(key)) {
      const element = template[key];
      map.set(key, template[key]);
    }
  }
  return map;
}

export function makeReverseMap(source: Map<any, any>): string[] {
  const result: string[] = [];
  source.forEach((value, name) => {
    result[value] = name;
  });
  return result;
}

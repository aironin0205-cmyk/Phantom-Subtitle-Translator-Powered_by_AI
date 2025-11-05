// ===== SHARED TYPES: CUSTOM TYPE DECLARATIONS =====
// This file provides type information for JavaScript libraries
// that do not have official @types packages.

declare module 'srt-parser-2' {
  export class Parser {
    fromSrt(srt: string): any[];
    toSrt(data: any[]): string;
  }
}

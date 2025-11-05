declare module 'srt-parser-2' {
  export class Parser {
    fromSrt(srt: string): any[];
    toSrt(data: any[]): string;
  }
}

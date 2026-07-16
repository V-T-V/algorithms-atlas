// zlib v2 · 实现（Adler-32 + 头部）
export interface ZlibResult {
  header: number[];
  adler32: number;
  size: number;
}
export interface ZlibHooks {
  onHeader?: (h: number[]) => void;
  onAdler?: (a: number) => void;
}
export function adler32(data: number[]): number {
  let a = 1;
  let b = 0;
  for (const x of data) {
    a = (a + x) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}
export function zlibWrap(input: string, hooks: ZlibHooks = {}): ZlibResult {
  const codes = input.split('').map((c) => c.charCodeAt(0));
  const header = [0x78, 0x9c]; // CMF=deflate32k, FLG=default level
  hooks.onHeader?.(header);
  const a = adler32(codes);
  hooks.onAdler?.(a);
  return { header, adler32: a, size: codes.length };
}

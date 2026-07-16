export interface AdHooks {
  onByte?: (i: number, s1: number, s2: number) => void;
}
export function adler32(data: number[], hooks: AdHooks = {}): number {
  let s1 = 1,
    s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]!) % 65521;
    s2 = (s2 + s1) % 65521;
    hooks.onByte?.(i, s1, s2);
  }
  return ((s2 << 16) | s1) >>> 0;
}

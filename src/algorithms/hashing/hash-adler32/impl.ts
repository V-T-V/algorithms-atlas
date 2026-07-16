// Adler-32 · 实现
export interface AdlerHooks {
  onByte?: (i: number, byte: number, s1: number, s2: number) => void;
  onConclude?: (checksum: number) => void;
}
const MOD = 65521;
export function adler32(data: string, hooks: AdlerHooks = {}): number {
  let s1 = 1,
    s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data.charCodeAt(i)) % MOD;
    s2 = (s2 + s1) % MOD;
    hooks.onByte?.(i, data.charCodeAt(i), s1, s2);
  }
  const out = (s2 << 16) | s1;
  hooks.onConclude?.(out >>> 0);
  return out >>> 0;
}

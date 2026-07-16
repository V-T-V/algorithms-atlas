// SimHash · 实现 (32-bit)
export interface ShHooks {
  onFeature?: (feat: string, weight: number, bits: number) => void;
  onConclude?: (fingerprint: number) => void;
}
export function simHash(
  features: ReadonlyArray<readonly [string, number]>,
  hooks: ShHooks = {},
): number {
  const v = new Array<number>(32).fill(0);
  for (const [feat, w] of features) {
    let h = 0;
    for (let i = 0; i < feat.length; i++) h = (h * 31 + feat.charCodeAt(i)) >>> 0;
    hooks.onFeature?.(feat, w, h);
    for (let b = 0; b < 32; b++) {
      const bit = (h >>> b) & 1;
      v[b]! += bit === 1 ? w : -w;
    }
  }
  let fp = 0;
  for (let b = 0; b < 32; b++) if (v[b]! > 0) fp |= 1 << b;
  hooks.onConclude?.(fp >>> 0);
  return fp >>> 0;
}
export function hamming32(a: number, b: number): number {
  let x = a ^ b,
    c = 0;
  while (x) {
    c += x & 1;
    x >>>= 1;
  }
  return c;
}

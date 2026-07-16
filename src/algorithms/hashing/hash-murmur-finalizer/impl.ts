// Murmur Finalizer (fmix32) · 实现
export interface MfHooks {
  onStep?: (step: string, h: number) => void;
  onConclude?: (hash: number) => void;
}
export function murmurFinalizer(h: number, hooks: MfHooks = {}): number {
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  hooks.onStep?.('mix1', x >>> 0);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  hooks.onStep?.('mix2', x >>> 0);
  x ^= x >>> 16;
  hooks.onStep?.('final', x >>> 0);
  hooks.onConclude?.(x >>> 0);
  return x >>> 0;
}
export function avalancheScore(hooks: MfHooks = {}): number {
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    const a = murmurFinalizer(0, hooks),
      b = murmurFinalizer(1 << i, hooks);
    let d = 0,
      x = a ^ b;
    while (x) {
      d += x & 1;
      x >>>= 1;
    }
    diff += d;
  }
  return diff / 32;
}

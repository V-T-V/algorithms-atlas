// HyperLogLog · 实现 (b=4 => 16 buckets)
export interface HllHooks {
  onAdd?: (hash: number, bucket: number, leadingZeros: number, updated: number) => void;
  onEstimate?: (estimate: number) => void;
}
export class HyperLogLog {
  b: number;
  m: number;
  M: number[];
  alpha: number;
  constructor(b = 4) {
    this.b = b;
    this.m = 1 << b;
    this.M = new Array<number>(this.m).fill(0);
    this.alpha = 0.7213 / (1 + 1.079 / this.m);
  }
  private hash(x: number): number {
    let h = x * 2654435761;
    h = (h ^ (h >>> 16)) >>> 0;
    return h;
  }
  add(x: number, hooks?: HllHooks) {
    const h = this.hash(x);
    const idx = h >>> (32 - this.b);
    const w = (h << this.b) | (1 << (this.b - 1));
    const lz = Math.clz32(w) + 1;
    if (lz > this.M[idx]!) {
      this.M[idx] = lz;
      hooks?.onAdd?.(h, idx, lz, lz);
    }
  }
  estimate(hooks?: HllHooks): number {
    let sum = 0;
    for (const v of this.M) sum += 2 ** -v;
    const e = (this.alpha * this.m * this.m) / sum;
    const est = e <= 2.5 * this.m ? Math.round(e) : Math.round(e);
    hooks?.onEstimate?.(est);
    return est;
  }
}
export function hllDemo(items: readonly number[], hooks: HllHooks = {}): number {
  const hll = new HyperLogLog(4);
  for (const x of items) hll.add(x, hooks);
  return hll.estimate(hooks);
}

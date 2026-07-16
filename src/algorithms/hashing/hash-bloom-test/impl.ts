// 布隆过滤器 · 实现
export interface BloomHooks {
  onAdd?: (item: string, bits: number[]) => void;
  onQuery?: (item: string, maybePresent: boolean) => void;
}
export class BloomFilter {
  bits: Uint8Array;
  k: number;
  m: number;
  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
    this.bits = new Uint8Array(m);
  }
  private idx(item: string, i: number): number {
    let h = (i + 1) * 131;
    for (let p = 0; p < item.length; p++) h = (h * 16777619) ^ item.charCodeAt(p);
    return (h >>> 0) % this.m;
  }
  add(item: string, hooks?: BloomHooks) {
    const set: number[] = [];
    for (let i = 0; i < this.k; i++) {
      const p = this.idx(item, i);
      this.bits[p] = 1;
      set.push(p);
    }
    hooks?.onAdd?.(item, set);
  }
  has(item: string, hooks?: BloomHooks): boolean {
    let ok = true;
    for (let i = 0; i < this.k; i++)
      if (this.bits[this.idx(item, i)] === 0) {
        ok = false;
        break;
      }
    hooks?.onQuery?.(item, ok);
    return ok;
  }
}
export function bloomDemo(
  items: readonly string[],
  queries: readonly string[],
  m: number,
  k: number,
  hooks: BloomHooks = {},
): { fp: number } {
  const bf = new BloomFilter(m, k);
  for (const it of items) bf.add(it, hooks);
  let fp = 0;
  for (const q of queries) if (bf.has(q, hooks) && !items.includes(q)) fp++;
  return { fp };
}

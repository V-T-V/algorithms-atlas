// 计数布隆过滤器 · 实现
export interface CbfHooks {
  onAdd?: (item: string, slots: number[]) => void;
  onRemove?: (item: string, slots: number[]) => void;
  onQuery?: (item: string, count: number) => void;
}
export class CountingBloom {
  counts: Uint8Array;
  k: number;
  m: number;
  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
    this.counts = new Uint8Array(m);
  }
  private idx(item: string, i: number): number {
    let h = i * 263;
    for (let p = 0; p < item.length; p++) h = (h * 31 + item.charCodeAt(p)) >>> 0;
    return h % this.m;
  }
  add(item: string, hooks?: CbfHooks) {
    const s: number[] = [];
    for (let i = 0; i < this.k; i++) {
      const p = this.idx(item, i);
      this.counts[p]!++;
      s.push(p);
    }
    hooks?.onAdd?.(item, s);
  }
  remove(item: string, hooks?: CbfHooks) {
    const s: number[] = [];
    for (let i = 0; i < this.k; i++) {
      const p = this.idx(item, i);
      if (this.counts[p]! > 0) this.counts[p]!--;
      s.push(p);
    }
    hooks?.onRemove?.(item, s);
  }
  has(item: string, hooks?: CbfHooks): boolean {
    const mn = Math.min(
      ...Array.from({ length: this.k }, (_, i) => this.counts[this.idx(item, i)]!),
    );
    hooks?.onQuery?.(item, mn);
    return mn > 0;
  }
}
export function countingBloomDemo(
  adds: readonly string[],
  removes: readonly string[],
  queries: readonly string[],
  m: number,
  k: number,
  hooks: CbfHooks = {},
): void {
  const cbf = new CountingBloom(m, k);
  for (const a of adds) cbf.add(a, hooks);
  for (const r of removes) cbf.remove(r, hooks);
  for (const q of queries) cbf.has(q, hooks);
}

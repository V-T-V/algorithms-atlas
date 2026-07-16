// Top-K 堆选择 · 实现

export interface TkHooks {
  onPush?: (value: number, heap: number[]) => void;
  onReplace?: (out: number, inn: number, heap: number[]) => void;
}

class MinHeap {
  private a: number[] = [];
  size(): number {
    return this.a.length;
  }
  top(): number | undefined {
    return this.a[0];
  }
  push(v: number): void {
    this.a.push(v);
    this.up(this.a.length - 1);
  }
  pop(): number | undefined {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0 && last !== undefined) {
      this.a[0] = last;
      this.down(0);
    }
    return top;
  }
  private up(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p]! > this.a[i]!) {
        [this.a[p], this.a[i]] = [this.a[i]!, this.a[p]!];
        i = p;
      } else break;
    }
  }
  private down(i: number): void {
    const n = this.a.length;
    while (true) {
      const l = 2 * i + 1,
        r = 2 * i + 2;
      let best = i;
      if (l < n && this.a[l]! < this.a[best]!) best = l;
      if (r < n && this.a[r]! < this.a[best]!) best = r;
      if (best === i) break;
      [this.a[i], this.a[best]] = [this.a[best]!, this.a[i]!];
      i = best;
    }
  }
  toArray(): number[] {
    return [...this.a];
  }
}

/** 返回前 k 大元素（降序）。 */
export function topKHeap(arr: readonly number[], k: number, hooks: TkHooks = {}): number[] {
  if (k <= 0) return [];
  const heap = new MinHeap();
  for (const v of arr) {
    if (heap.size() < k) {
      heap.push(v);
      hooks.onPush?.(v, heap.toArray());
    } else if (v > (heap.top() ?? -Infinity)) {
      const out = heap.pop()!;
      heap.push(v);
      hooks.onReplace?.(out, v, heap.toArray());
    }
  }
  return heap.toArray().sort((a, b) => b - a);
}

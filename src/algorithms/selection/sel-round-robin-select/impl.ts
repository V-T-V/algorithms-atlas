// 轮转选择 · 实现

export class RoundRobinSelect<T> {
  private cursor = 0;
  public readonly counts: number[];

  constructor(public readonly items: T[]) {
    if (items.length === 0) throw new Error('items 为空');
    this.counts = new Array(items.length).fill(0);
  }

  next(): T {
    const item = this.items[this.cursor]!;
    this.counts[this.cursor]!++;
    this.cursor = (this.cursor + 1) % this.items.length;
    return item;
  }

  sample(n: number): T[] {
    const out: T[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }

  reset(): void {
    this.cursor = 0;
    this.counts.fill(0);
  }
}

export function roundRobinSample<T>(items: T[], n: number): T[] {
  return new RoundRobinSelect(items).sample(n);
}

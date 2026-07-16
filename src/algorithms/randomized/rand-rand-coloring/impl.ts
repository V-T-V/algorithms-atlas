// 共享 LCG 随机源（测试可复现）
class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 1;
  }
  next(): number {
    // xorshift32
    let x = this.s;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.s = x >>> 0;
    return this.s / 0x100000000;
  }
  range(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]!;
  }
}
export { Rng as ColRng };

export function randomColoring(adj: number[][], seed: number): number[] {
  const n = adj.length;
  const colors = new Array<number>(n).fill(-1);
  const r = new Rng(seed);
  const order = adj.map((_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    [order[i]!, order[j]!] = [order[j]!, order[i]!];
  }
  for (const v of order) {
    const used = new Set<number>();
    for (const u of adj[v]!) if (colors[u]! >= 0) used.add(colors[u]!);
    let c = 0;
    while (used.has(c)) c++;
    colors[v] = c;
  }
  return colors;
}

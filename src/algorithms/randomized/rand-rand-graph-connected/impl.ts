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
export { Rng as RGCRng };

export function reachableFraction(
  adj: number[][],
  start: number,
  walks: number,
  len: number,
  seed: number,
): number {
  const r = new Rng(seed);
  const reached = new Set<number>([start]);
  for (let w = 0; w < walks; w++) {
    let cur = start;
    for (let i = 0; i < len; i++) {
      const nbrs = adj[cur]!;
      if (nbrs.length === 0) break;
      cur = nbrs[Math.floor(r.next() * nbrs.length)]!;
      reached.add(cur);
    }
  }
  return reached.size / adj.length;
}

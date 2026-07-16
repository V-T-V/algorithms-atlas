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
export { Rng as MCR2Rng };

export function maxCutLocal(
  edges: [number, number][],
  n: number,
  seed: number,
  iters = 1000,
): { side: boolean[]; cut: number } {
  const r = new Rng(seed);
  const side = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) side[i] = r.next() < 0.5;
  let improved = true;
  while (improved && iters-- > 0) {
    improved = false;
    for (let v = 0; v < n; v++) {
      let same = 0,
        diff = 0;
      for (const [a, b] of edges) {
        const u = a === v ? b : b === v ? a : -1;
        if (u === -1) continue;
        if (side[v] === side[u]) same++;
        else diff++;
      }
      if (same > diff) {
        side[v] = !side[v];
        improved = true;
      }
    }
  }
  let cut = 0;
  for (const [a, b] of edges) if (side[a] !== side[b]) cut++;
  return { side, cut };
}

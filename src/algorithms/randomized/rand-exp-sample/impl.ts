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
export { Rng as ERng };

export function exponentialSamples(seed: number, lambda: number, n: number): number[] {
  const r = new Rng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(-Math.log(Math.max(r.next(), 1e-12)) / lambda);
  return out;
}

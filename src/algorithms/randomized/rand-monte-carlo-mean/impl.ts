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
export { Rng as MCMRng };

export function monteCarloMean(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  seed: number,
): number {
  const r = new Rng(seed);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + r.next() * (b - a));
  return sum / n;
}

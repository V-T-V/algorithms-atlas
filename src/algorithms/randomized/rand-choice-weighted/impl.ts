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
export { Rng as WCRng };

export function weightedChoice(weights: number[], seed: number): number {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new RangeError('权重总和必须为正');
  const r = new Rng(seed);
  let t = r.next() * total;
  for (let i = 0; i < weights.length; i++) {
    t -= weights[i]!;
    if (t < 0) return i;
  }
  return weights.length - 1;
}

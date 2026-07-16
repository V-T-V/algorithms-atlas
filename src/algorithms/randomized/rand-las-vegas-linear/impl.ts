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
export { Rng as LVRng };

// 简化版：1 维 LP（最大化 c·x 满足 ax≤b）
export function lp1dMax(a: number[], b: number[], c: number): number | null {
  let upper = Infinity,
    lower = -Infinity;
  for (let i = 0; i < a.length; i++) {
    if (a[i]! > 0) upper = Math.min(upper, b[i]! / a[i]!);
    else if (a[i]! < 0) lower = Math.max(lower, b[i]! / a[i]!);
    else if (b[i]! < 0) return null; // 0·x≤b<0 不可行
  }
  if (lower > upper) return null;
  return c >= 0 ? upper : lower;
}

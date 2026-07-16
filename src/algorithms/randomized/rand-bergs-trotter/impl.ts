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
export { Rng as BTRng };

export function estimateCardinality(items: number[], seed: number): number {
  const r = new Rng(seed);
  let maxK = 0;
  for (const x of items) {
    let h = ((x * 2654435761) ^ Math.floor(r.next() * 1e9)) >>> 0;
    if (h === 0) continue;
    let k = 0;
    while ((h & 1) === 0) {
      k++;
      h >>>= 1;
    }
    if (k > maxK) maxK = k;
  }
  return Math.floor(2 ** maxK);
}

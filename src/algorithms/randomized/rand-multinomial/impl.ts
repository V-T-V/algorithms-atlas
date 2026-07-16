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
export { Rng as MNRng };

export function multinomialSample(probs: number[], n: number, seed: number): number[] {
  const r = new Rng(seed);
  const counts = new Array<number>(probs.length).fill(0);
  let remaining = n;
  let psum = probs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < probs.length - 1; i++) {
    if (remaining <= 0) break;
    const x = sampleBinomial(r, Math.min(probs[i]! / psum, 1), remaining);
    counts[i] = x;
    remaining -= x;
    psum -= probs[i]!;
  }
  counts[counts.length - 1] = remaining;
  return counts;
}
function sampleBinomial(r: Rng, p: number, n: number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (r.next() < p) k++;
  return k;
}

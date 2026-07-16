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
export { Rng as TSRng };

export function twoSumExists(arr: number[], target: number, seed: number): boolean {
  const r = new Rng(seed);
  const seen = new Set<number>();
  // Randomized order traversal
  const order = arr.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    [order[i]!, order[j]!] = [order[j]!, order[i]!];
  }
  for (const idx of order) {
    const v = arr[idx]!;
    if (seen.has(target - v)) return true;
    seen.add(v);
  }
  return false;
}

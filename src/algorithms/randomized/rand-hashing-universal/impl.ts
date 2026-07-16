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
export { Rng as UHRng };

export class UniversalHash {
  private a: number;
  private b: number;
  private p: number;
  private m: number;
  constructor(m: number, seed: number, p = 2147483647) {
    const r = new Rng(seed);
    this.m = m;
    this.p = p;
    this.a = 1 + Math.floor(r.next() * (p - 1));
    this.b = Math.floor(r.next() * p);
  }
  hash(x: number): number {
    return ((this.a * x + this.b) % this.p) % this.m;
  }
}

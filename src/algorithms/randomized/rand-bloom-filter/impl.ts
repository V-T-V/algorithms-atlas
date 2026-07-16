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
export { Rng as BFRng };

export class BloomFilter {
  private bits: Uint8Array;
  private m: number;
  private k: number;
  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
    this.bits = new Uint8Array(m);
  }
  private hashes(s: string): number[] {
    const out: number[] = [];
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    for (let i = 0; i < this.k; i++) {
      h = (h * 1103515245 + 12345 + i * 7) >>> 0;
      out.push(h % this.m);
    }
    return out;
  }
  add(s: string): void {
    for (const idx of this.hashes(s)) this.bits[idx] = 1;
  }
  has(s: string): boolean {
    return this.hashes(s).every((i) => this.bits[i] === 1);
  }
}

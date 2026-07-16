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
export { Rng as FPRng };

export function fingerprint(str: string, seed: number): number {
  const r = new Rng(seed);
  const base = 257;
  const mod = 1e9 + 7;
  const salt = Math.floor(r.next() * 1000);
  let h = salt % mod;
  for (let i = 0; i < str.length; i++) h = (h * base + str.charCodeAt(i)) % mod;
  return h;
}
export function equalByFingerprint(a: string, b: string, seed: number): boolean {
  return fingerprint(a, seed) === fingerprint(b, seed);
}

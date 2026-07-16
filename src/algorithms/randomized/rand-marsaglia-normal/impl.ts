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
export { Rng as MPRng };

export function marsagliaNormals(seed: number, n: number): number[] {
  const r = new Rng(seed);
  const out: number[] = [];
  let spare: number | null = null;
  while (out.length < n) {
    if (spare !== null) {
      out.push(spare);
      spare = null;
      continue;
    }
    let u = 0,
      v = 0,
      s = 0;
    do {
      u = r.next() * 2 - 1;
      v = r.next() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const mul = Math.sqrt((-2 * Math.log(s)) / s);
    out.push(u * mul);
    spare = v * mul;
  }
  return out;
}

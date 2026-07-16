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
export { Rng as GMRng };

function sampleGamma(r: Rng, shape: number, scale: number): number {
  if (shape < 1)
    return sampleGamma(r, shape + 1, scale) * Math.pow(Math.max(r.next(), 1e-12), 1 / shape);
  const d = shape - 1 / 3,
    c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number, v: number;
    do {
      x = normalStd(r);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = r.next();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}
function normalStd(r: Rng): number {
  const u1 = Math.max(r.next(), 1e-12),
    u2 = r.next();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
export function gammaSamples(seed: number, shape: number, scale: number, n: number): number[] {
  const r = new Rng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(sampleGamma(r, shape, scale));
  return out;
}

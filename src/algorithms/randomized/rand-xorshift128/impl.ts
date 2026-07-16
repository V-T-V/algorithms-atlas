// xorshift128 · 实现
export class Xorshift128 {
  private a = 123456789;
  private b = 362436069;
  private c = 521288629;
  private d = 88675123;
  constructor(seed: number) {
    this.a = seed >>> 0 || 1;
  }
  next(): number {
    const t = this.a ^ (this.a << 11);
    this.a = this.b;
    this.b = this.c;
    this.c = this.d;
    this.d = this.d ^ (this.d >>> 19) ^ (t ^ (t >>> 8));
    return (this.d >>> 0) / 0x100000000;
  }
}
export function xorshift128Seq(seed: number, n: number): number[] {
  const r = new Xorshift128(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}

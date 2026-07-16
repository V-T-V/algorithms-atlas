// RC4 随机数 · 实现

export class Rc4Rng {
  private s: number[];
  private i = 0;
  private j = 0;

  constructor(seed: number[] = [1, 2, 3, 4, 5]) {
    this.s = Array.from({ length: 256 }, (_, k) => k);
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + this.s[i]! + seed[i % seed.length]!) & 0xff;
      const t = this.s[i]!;
      this.s[i] = this.s[j]!;
      this.s[j] = t;
    }
  }

  nextByte(): number {
    this.i = (this.i + 1) & 0xff;
    this.j = (this.j + this.s[this.i]!) & 0xff;
    const t = this.s[this.i]!;
    this.s[this.i] = this.s[this.j]!;
    this.s[this.j] = t;
    return this.s[(this.s[this.i]! + this.s[this.j]!) & 0xff]!;
  }

  next(): number {
    // 取 4 字节拼 32 位
    let v = 0;
    for (let k = 0; k < 4; k++) v = (v << 8) | this.nextByte();
    return (v >>> 0) / 0x100000000;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function rc4Rng(n: number, seed: number[] = [1, 2, 3]): number[] {
  return new Rc4Rng(seed).sample(n);
}

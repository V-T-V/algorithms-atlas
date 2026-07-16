// KISS 生成器 · 实现（32 位版本）

const M = 0x100000000;

export class Kiss {
  private x: number;
  private y: number;
  private z: number;
  private c: number;

  constructor(seed = 123456789) {
    this.x = seed >>> 0 || 362436069;
    this.y = ((seed * 1812433253) ^ 0x9e3779b9) >>> 0 || 521288629;
    this.z = ((seed * 1664525) ^ 0x85ebca6b) >>> 0 || 123456789;
    this.c = 0;
  }

  nextUint(): number {
    // MWC 部分
    this.y = (Math.imul(this.y, 36969) + (this.y >>> 16)) >>> 0;
    // xorshift 部分
    this.z ^= this.z << 13;
    this.z ^= this.z >>> 17;
    this.z ^= this.z << 5;
    this.z >>>= 0;
    // LCG 部分
    this.x = (Math.imul(69069, this.x) + 1234567) >>> 0;
    return ((this.x + (this.y << 16)) ^ this.z) >>> 0;
  }

  next(): number {
    return this.nextUint() / M;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function kiss(n: number, seed = 123456789): number[] {
  return new Kiss(seed).sample(n);
}

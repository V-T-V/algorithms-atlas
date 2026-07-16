// 乘借位生成器 MWC · 实现

const A = 4294957665; // Marsaglia 推荐
const B = 0xffffffff; // 2^32 - 1

export class Mwc {
  private x: number;
  private carry: number;

  constructor(seed = 4294967295) {
    this.x = seed >>> 0 || 1;
    this.carry = 0;
  }

  nextUint(): number {
    const t = Math.imul(A, this.x >>> 0) + this.carry;
    this.x = t >>> 0;
    this.carry = Math.floor(t / (B + 1));
    return this.x;
  }

  next(): number {
    return this.nextUint() / (B + 1);
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function mwc(n: number, seed = 4294967295): number[] {
  return new Mwc(seed).sample(n);
}

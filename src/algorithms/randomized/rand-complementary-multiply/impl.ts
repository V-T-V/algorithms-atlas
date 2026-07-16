// 补乘同余生成器 CMWC · 实现

// 简化 CMWC：x = a*x + carry; 输出 (M-1) - (x mod M)
const A = 18782; // 乘数
const M = 4096 * 16; // 模（取 2 的幂便于位运算，但这里用普通模）
const R = 0xfffffffe; // 种子范围

export class Cmwc {
  private x: number;
  private carry: number;

  constructor(seed = 987654321) {
    this.x = seed % R || 1;
    this.carry = 362436;
  }

  nextInt(): number {
    const t = A * this.x + this.carry;
    this.carry = Math.floor(t / M);
    this.x = t % M;
    return M - 1 - this.x; // 补数
  }

  next(): number {
    return this.nextInt() / M;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function cmwc(n: number, seed = 987654321): number[] {
  return new Cmwc(seed).sample(n);
}

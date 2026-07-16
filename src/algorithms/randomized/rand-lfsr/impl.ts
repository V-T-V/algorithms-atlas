// 线性反馈移位寄存器 LFSR · 实现（16 位 Galois）

const TAPS16 = 0xb400; // 16 位最大长度 LFSR 反馈多项式

export class Lfsr {
  private state: number;

  constructor(seed = 0xace1) {
    // 不能为 0（全 0 是不动点）
    this.state = seed & 0xffff;
    if (this.state === 0) this.state = 0xace1;
  }

  nextBit(): number {
    const lsb = this.state & 1;
    this.state >>= 1;
    if (lsb) this.state ^= TAPS16;
    return lsb;
  }

  /** 取 16 位输出。 */
  nextUint16(): number {
    let v = 0;
    for (let i = 0; i < 16; i++) {
      v = (v << 1) | this.nextBit();
    }
    return v >>> 0;
  }

  next(): number {
    return this.nextUint16() / 0x10000;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function lfsr(n: number, seed = 0xace1): number[] {
  return new Lfsr(seed).sample(n);
}

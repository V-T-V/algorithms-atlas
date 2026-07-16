// Lehmer 随机数 · 实现（Schrage 方法）

const M = 0x7fffffff; // 2^31 - 1
const A = 16807; // 7^5
const Q = Math.floor(M / A); // 127773
const R = M % A; // 2836

export class Lehmer {
  private state: number;

  constructor(seed = 1) {
    this.state = seed % M;
    if (this.state <= 0) this.state += M - 1;
  }

  /** 返回内部状态 [1, M-1]。 */
  nextInt(): number {
    // Schrage: state = A*(state mod Q) - R*floor(state/Q); 若 <0 加 M
    const hi = Math.floor(this.state / Q);
    const lo = this.state % Q;
    const t = A * lo - R * hi;
    this.state = t > 0 ? t : t + M;
    return this.state;
  }

  /** 返回 [0,1)。 */
  next(): number {
    return this.nextInt() / M;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function lehmer(n: number, seed = 1): number[] {
  return new Lehmer(seed).sample(n);
}

// Wichmann-Hill 生成器 · 实现

export class WichmannHill {
  private x: number;
  private y: number;
  private z: number;

  constructor(seed = 1234567) {
    this.x = seed % 30269 || 1;
    this.y = (seed >> 3) % 30307 || 1;
    this.z = (seed >> 7) % 30323 || 1;
  }

  /** 返回 [0,1)。 */
  next(): number {
    this.x = (171 * this.x) % 30269;
    this.y = (172 * this.y) % 30307;
    this.z = (170 * this.z) % 30323;
    const s = this.x / 30269 + this.y / 30307 + this.z / 30323;
    return s - Math.floor(s);
  }

  /** 生成 n 个样本。 */
  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

/** 便捷：用 seed 生成 n 个样本。 */
export function wichmannHill(n: number, seed = 1234567): number[] {
  return new WichmannHill(seed).sample(n);
}

// Phi 快速随机 · 实现

const PHI = (Math.sqrt(5) - 1) / 2; // ≈ 0.6180339887

export class PhiFast {
  private x: number;

  constructor(seed = 0) {
    this.x = (seed * PHI) % 1;
    if (this.x < 0) this.x += 1;
  }

  next(): number {
    this.x += PHI;
    if (this.x >= 1) this.x -= 1;
    return this.x;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function phiFast(n: number, seed = 0): number[] {
  return new PhiFast(seed).sample(n);
}

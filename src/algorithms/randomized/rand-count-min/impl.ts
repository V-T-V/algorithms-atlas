// Count-Min Sketch · 实现
export class CountMin {
  private table: number[][];
  private d: number;
  private w: number;
  constructor(d: number, w: number) {
    this.d = d;
    this.w = w;
    this.table = Array.from({ length: d }, () => new Array<number>(w).fill(0));
  }
  private hash(row: number, key: number): number {
    return ((key * (row + 1) * 2654435761) >>> 0) % this.w;
  }
  add(key: number, count = 1): void {
    for (let r = 0; r < this.d; r++) this.table[r]![this.hash(r, key)]! += count;
  }
  estimate(key: number): number {
    let min = Infinity;
    for (let r = 0; r < this.d; r++) {
      const c = this.table[r]![this.hash(r, key)]!;
      if (c < min) min = c;
    }
    return min === Infinity ? 0 : min;
  }
}

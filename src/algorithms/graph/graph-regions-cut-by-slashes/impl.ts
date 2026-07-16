// =============================================================================
// 斜杠划分区域 · 纯算法实现（3×3 放大 + 并查集）
// =============================================================================

export interface RegionsBySlashesHooks {
  onResult?: (regions: number) => void;
}

class CoordUF {
  parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    if (this.parent[x]! !== x) this.parent[x] = this.find(this.parent[x]!);
    return this.parent[x]!;
  }
  union(a: number, b: number): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent[rb] = ra;
  }
}

export function regionsBySlashes(grid: string[], hooks: RegionsBySlashesHooks = {}): number {
  const n = grid.length;
  const N = n * 3;
  const g: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const ch = grid[i]![j]!;
      if (ch === '/') {
        g[i * 3]![j * 3 + 2] = 1;
        g[i * 3 + 1]![j * 3 + 1] = 1;
        g[i * 3 + 2]![j * 3] = 1;
      } else if (ch === '\\') {
        g[i * 3]![j * 3] = 1;
        g[i * 3 + 1]![j * 3 + 1] = 1;
        g[i * 3 + 2]![j * 3 + 2] = 1;
      }
    }
  }
  const uf = new CoordUF(N * N);
  const DIRS: ReadonlyArray<[number, number]> = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (g[r]![c]! === 1) continue;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (g[nr]![nc]! === 1) continue;
        uf.union(r * N + c, nr * N + nc);
      }
    }
  }
  let count = 0;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (g[r]![c]! === 0 && uf.find(r * N + c) === r * N + c) count++;
    }
  }
  hooks.onResult?.(count);
  return count;
}

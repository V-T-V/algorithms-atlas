// =============================================================================
// A* 网格寻路（曼哈顿启发）· 纯算法实现
// =============================================================================

export interface GridPoint {
  r: number;
  c: number;
}

export interface AStarGridHooks {
  onPop?: (p: GridPoint, g: number, f: number) => void;
  onRelax?: (from: GridPoint, to: GridPoint, g: number, improved: boolean) => void;
  onDone?: (found: boolean, dist: number) => void;
}

const key = (p: GridPoint): string => `${p.r},${p.c}`;

function manhattan(a: GridPoint, b: GridPoint): number {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

export interface AStarGridResult {
  found: boolean;
  dist: number;
  prev: Map<string, string | null>;
}

export function aStarGrid(
  grid: ReadonlyArray<readonly number[]>,
  source: GridPoint,
  target: GridPoint,
  hooks: AStarGridHooks = {},
): AStarGridResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const passable = (p: GridPoint): boolean =>
    p.r >= 0 && p.r < rows && p.c >= 0 && p.c < cols && grid[p.r]![p.c]! === 0;
  const gScore = new Map<string, number>();
  const prev = new Map<string, string | null>();
  if (!passable(source) || !passable(target)) {
    hooks.onDone?.(false, Infinity);
    return { found: false, dist: Infinity, prev };
  }
  gScore.set(key(source), 0);
  prev.set(key(source), null);
  const open = new Set<string>([key(source)]);
  const pos = new Map<string, GridPoint>([[key(source), source]]);
  const closed = new Set<string>();
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  while (open.size > 0) {
    // 选 f 最小
    let bestK: string | null = null;
    let bestF = Infinity;
    for (const k of open) {
      const g = gScore.get(k) ?? Infinity;
      const f = g + manhattan(pos.get(k)!, target);
      if (f < bestF) {
        bestF = f;
        bestK = k;
      }
    }
    if (bestK === null) break;
    const u = pos.get(bestK)!;
    const gu = gScore.get(bestK)!;
    open.delete(bestK);
    closed.add(bestK);
    hooks.onPop?.(u, gu, bestF);
    if (bestK === key(target)) {
      hooks.onDone?.(true, gu);
      return { found: true, dist: gu, prev };
    }
    for (const d of dirs) {
      const v: GridPoint = { r: u.r + d.r, c: u.c + d.c };
      if (!passable(v) || closed.has(key(v))) continue;
      const ng = gu + 1;
      const improved = ng < (gScore.get(key(v)) ?? Infinity);
      if (improved) {
        gScore.set(key(v), ng);
        prev.set(key(v), bestK);
        open.add(key(v));
        pos.set(key(v), v);
      }
      hooks.onRelax?.(u, v, ng, improved);
    }
  }
  hooks.onDone?.(false, Infinity);
  return { found: false, dist: Infinity, prev };
}

export function reconstructPath(
  prev: Map<string, string | null>,
  source: GridPoint,
  target: GridPoint,
): GridPoint[] | null {
  const path: GridPoint[] = [];
  let cur: string | null = key(target);
  let guard = 0;
  while (cur !== null && guard <= prev.size) {
    const parts = cur.split(',').map(Number);
    const r = parts[0]!;
    const c = parts[1]!;
    path.push({ r, c });
    cur = prev.get(cur) ?? null;
    guard++;
  }
  if (path[path.length - 1]!.r !== source.r || path[path.length - 1]!.c !== source.c) return null;
  path.reverse();
  return path;
}

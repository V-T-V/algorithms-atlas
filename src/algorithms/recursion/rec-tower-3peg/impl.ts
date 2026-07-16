// rec-tower-3peg · 实现（3柱汉诺塔）
export interface HanoiHooks {
  onMove?: (depth: number, disk: number, from: number, to: number) => void;
  onBase?: (depth: number, disk: number, from: number, to: number) => void;
}
export interface HanoiResult {
  result: string;
  depth: number;
  calls: number;
  moves: Array<[number, number, number]>;
}
export function recTower3peg(n: number, hooks: HanoiHooks = {}): HanoiResult {
  let calls = 0;
  let maxDepth = 0;
  const moves: Array<[number, number, number]> = [];
  const go = (k: number, from: number, to: number, via: number, depth: number): void => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k === 1) {
      moves.push([k, from, to]);
      hooks.onBase?.(depth, k, from, to);
      return;
    }
    go(k - 1, from, via, to, depth + 1);
    moves.push([k, from, to]);
    hooks.onMove?.(depth, k, from, to);
    go(k - 1, via, to, from, depth + 1);
  };
  go(n, 0, 2, 1, 0);
  return { result: `${moves.length} moves`, depth: maxDepth, calls, moves };
}

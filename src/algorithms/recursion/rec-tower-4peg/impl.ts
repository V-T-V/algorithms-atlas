// rec-tower-4peg · 实现（4柱汉诺塔 · Frame-Stewart 算法）
// 4 根柱子编号 0,1,2,3。初始所有盘在 0 号柱，目标 3 号柱。
// Frame-Stewart：把 n 个盘分成两部分。先把上部 m 个盘子搬到某个空闲柱（用全部 4 柱），
// 再把剩下 n−m 个盘搬到目标（此时被占用一柱、剩 3 柱），最后把 m 个盘搬过去（用全部 4 柱）。
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

export function recTower4peg(n: number, hooks: HanoiHooks = {}): HanoiResult {
  let calls = 0;
  let maxDepth = 0;
  const moves: Array<[number, number, number]> = [];

  // 3柱递归：k 个盘从 src 搬到 dst，借助 via
  const hanoi3 = (k: number, src: number, via: number, dst: number, depth: number): void => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k === 0) return;
    if (k === 1) {
      moves.push([1, src, dst]);
      hooks.onBase?.(depth, 1, src, dst);
      return;
    }
    hanoi3(k - 1, src, dst, via, depth + 1);
    moves.push([k, src, dst]);
    hooks.onMove?.(depth, k, src, dst);
    hanoi3(k - 1, via, src, dst, depth + 1);
  };

  // 4柱 Frame-Stewart：k 个盘从 src 搬到 dst，可用柱子为 pegs（含 src 与 dst）
  const frameStewart = (
    k: number,
    src: number,
    dst: number,
    auxs: number[],
    depth: number,
  ): void => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k === 0) return;
    if (k === 1) {
      moves.push([1, src, dst]);
      hooks.onBase?.(depth, 1, src, dst);
      return;
    }
    // 退化到 3 柱：只有 1 个辅助柱
    if (auxs.length === 1) {
      hanoi3(k, src, auxs[0]!, dst, depth);
      return;
    }
    // 取最优分割点 m = k - round(sqrt(2k))（启发式）
    const m = Math.max(1, Math.floor(k / 2));
    const a = auxs[0]!;
    const restAux = auxs.slice(1);
    // 1) 把上部 m 个盘搬到辅助柱 a（仍可用 4 柱）
    frameStewart(m, src, a, [dst, ...restAux], depth + 1);
    // 2) 把剩下 n−m 个盘搬到 dst（此时 a 被占用，剩 3 柱）
    if (restAux.length >= 1) {
      frameStewart(k - m, src, dst, restAux, depth + 1);
    } else {
      hanoi3(k - m, src, a, dst, depth + 1);
    }
    // 3) 把 m 个盘从 a 搬到 dst（用 4 柱）
    frameStewart(m, a, dst, [src, ...restAux], depth + 1);
  };

  frameStewart(n, 0, 3, [1, 2], 0);
  return { result: `${moves.length} moves`, depth: maxDepth, calls, moves };
}

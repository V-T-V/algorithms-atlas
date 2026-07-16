const MOVES: Array<[number, number]> = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];
export interface KtHooks {
  onMove?: (r: number, c: number, step: number) => void;
  onResult?: (board: number[][]) => void;
}
export function knightsTour(
  n: number,
  sr: number = 0,
  sc: number = 0,
  hooks: KtHooks = {},
): number[][] | null {
  const board = Array.from({ length: n }, () => new Array(n).fill(-1));
  const go = (r: number, c: number, step: number): boolean => {
    if (step === n * n) return true;
    for (const [dr, dc] of MOVES) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || board[nr]![nc] !== -1) continue;
      board[nr]![nc] = step;
      hooks.onMove?.(nr, nc, step);
      if (go(nr, nc, step + 1)) return true;
      board[nr]![nc] = -1;
    }
    return false;
  };
  board[sr]![sc] = 0;
  hooks.onMove?.(sr, sc, 0);
  if (go(sr, sc, 1)) {
    hooks.onResult?.(board);
    return board;
  }
  return null;
}

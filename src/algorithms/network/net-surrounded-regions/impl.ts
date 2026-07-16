export interface SrHooks {
  onFlip?: (r: number, c: number) => void;
  onResult?: () => void;
}
export function solveSurrounded(board: string[][], hooks: SrHooks = {}): string[][] {
  const R = board.length;
  if (R === 0) return board;
  const C = board[0]!.length;
  const dfs = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== 'O') return;
    board[r]![c] = 'T';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };
  for (let r = 0; r < R; r++) {
    dfs(r, 0);
    dfs(r, C - 1);
  }
  for (let c = 0; c < C; c++) {
    dfs(0, c);
    dfs(R - 1, c);
  }
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (board[r]![c] === 'O') {
        board[r]![c] = 'X';
        hooks.onFlip?.(r, c);
      } else if (board[r]![c] === 'T') board[r]![c] = 'O';
    }
  hooks.onResult?.();
  return board;
}

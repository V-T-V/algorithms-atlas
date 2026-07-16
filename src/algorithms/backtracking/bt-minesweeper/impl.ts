export interface MswHooks {
  onReveal?: (r: number, c: number) => void;
  onResult?: () => void;
}
export function updateBoard(
  board: string[][],
  click: Array<number>,
  hooks: MswHooks = {},
): string[][] {
  const r = click[0]!;
  const c = click[1]!;
  const R = board.length,
    C = board[0]!.length;
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  if (board[r!]![c!] === 'M') {
    board[r!]![c!] = 'X';
    hooks.onResult?.();
    return board;
  }
  const countMines = (r: number, c: number): number => {
    let n = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr!,
        nc = c + dc!;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && board[nr]![nc] === 'M') n++;
    }
    return n;
  };
  const dfs = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== 'E') return;
    const n = countMines(r, c);
    if (n > 0) {
      board[r]![c] = String(n);
      hooks.onReveal?.(r, c);
    } else {
      board[r]![c] = 'B';
      hooks.onReveal?.(r, c);
      for (const [dr, dc] of dirs) dfs(r + dr!, c + dc!);
    }
  };
  dfs(r, c);
  hooks.onResult?.();
  return board;
}

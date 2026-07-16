export interface WsHooks {
  onStep?: (r: number, c: number, idx: number) => void;
  onResult?: (ok: boolean) => void;
}
export function exist(board: string[][], word: string, hooks: WsHooks = {}): boolean {
  const R = board.length,
    C = board[0]!.length;
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== word[i]) return false;
    const tmp = board[r]![c];
    hooks.onStep?.(r, c, i);
    board[r]![c] = '#';
    const ok =
      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r]![c] = tmp!;
    return ok;
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (dfs(r, c, 0)) {
        hooks.onResult?.(true);
        return true;
      }
  hooks.onResult?.(false);
  return false;
}

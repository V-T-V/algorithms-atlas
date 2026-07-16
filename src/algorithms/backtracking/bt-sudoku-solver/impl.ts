export interface SdHooks {
  onTry?: (r: number, c: number, v: number) => void;
  onSolved?: () => void;
}
export function solveSudoku(board: string[][], hooks: SdHooks = {}): boolean {
  const valid = (r: number, c: number, ch: string): boolean => {
    for (let i = 0; i < 9; i++) if (board[r]![i] === ch || board[i]![c] === ch) return false;
    const br = Math.floor(r / 3) * 3,
      bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (board[br + i]![bc + j] === ch) return false;
    return true;
  };
  const go = (): boolean => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) {
        if (board[r]![c] !== '.') continue;
        for (let v = 1; v <= 9; v++) {
          const ch = String(v);
          if (!valid(r, c, ch)) continue;
          board[r]![c] = ch;
          hooks.onTry?.(r, c, v);
          if (go()) return true;
          board[r]![c] = '.';
        }
        return false;
      }
    hooks.onSolved?.();
    return true;
  };
  return go();
}

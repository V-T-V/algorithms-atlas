// =============================================================================
// 验证数独 · 纯算法实现
// =============================================================================
export interface BtSudokuValidHooks {
  onCell?: (r: number, c: number, ch: string) => void;
  onConflict?: (r: number, c: number, ch: string, where: string) => void;
}

export function btSudokuValid(board: string[][], hooks: BtSudokuValidHooks = {}): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = board[r]![c]!;
      if (ch === '.') continue;
      hooks.onCell?.(r, c, ch);
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r]!.has(ch) || cols[c]!.has(ch) || boxes[b]!.has(ch)) {
        const where = rows[r]!.has(ch) ? 'row' : cols[c]!.has(ch) ? 'col' : 'box';
        hooks.onConflict?.(r, c, ch, where);
        return false;
      }
      rows[r]!.add(ch);
      cols[c]!.add(ch);
      boxes[b]!.add(ch);
    }
  }
  return true;
}

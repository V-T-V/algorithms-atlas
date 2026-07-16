export interface QHooks {
  onPlace?: (r: number, c: number) => void;
  onBacktrack?: (r: number, c: number) => void;
  onResult?: (n: number) => void;
}
export function totalNQueens(n: number, hooks: QHooks = {}): number {
  const col = new Set<number>(),
    diag1 = new Set<number>(),
    diag2 = new Set<number>();
  let count = 0;
  const go = (r: number) => {
    if (r === n) {
      count++;
      hooks.onResult?.(count);
      return;
    }
    for (let c = 0; c < n; c++) {
      if (col.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
      col.add(c);
      diag1.add(r - c);
      diag2.add(r + c);
      hooks.onPlace?.(r, c);
      go(r + 1);
      col.delete(c);
      diag1.delete(r - c);
      diag2.delete(r + c);
      hooks.onBacktrack?.(r, c);
    }
  };
  go(0);
  return count;
}

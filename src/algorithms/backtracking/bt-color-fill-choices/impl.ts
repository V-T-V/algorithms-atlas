export interface DtHooks {
  onPlace?: (col: number, vertical: boolean) => void;
  onResult?: (count: number) => void;
}
export function dominoTiling(n: number, hooks: DtHooks = {}): number {
  let count = 0;
  const grid: boolean[][] = Array.from({ length: 2 }, () => new Array(n).fill(false));
  const go = (r: number, c: number) => {
    if (c === n) {
      count++;
      hooks.onResult?.(count);
      return;
    }
    if (r === 2) {
      go(0, c + 1);
      return;
    }
    if (grid[r]![c]!) {
      go(r + 1, c);
      return;
    }
    // 横放
    if (c + 1 < n && !grid[r]![c + 1]!) {
      grid[r]![c] = true;
      grid[r]![c + 1] = true;
      hooks.onPlace?.(c, false);
      go(r + 1, c);
      grid[r]![c] = false;
      grid[r]![c + 1] = false;
    }
    // 竖放
    if (r === 0 && !grid[r + 1]![c]!) {
      grid[r]![c] = true;
      grid[r + 1]![c] = true;
      hooks.onPlace?.(c, true);
      go(r + 1, c);
      grid[r]![c] = false;
      grid[r + 1]![c] = false;
    }
  };
  go(0, 0);
  return count;
}

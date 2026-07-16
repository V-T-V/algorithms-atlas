export interface FloodHooks {
  onFill?: (r: number, c: number) => void;
  onResult?: (grid: number[][]) => void;
}
export function floodFill(
  grid: number[][],
  sr: number,
  sc: number,
  newColor: number,
  hooks: FloodHooks = {},
): number[][] {
  const orig = grid[sr]?.[sc];
  if (orig === undefined || orig === newColor) return grid;
  const R = grid.length,
    C = grid[0]!.length;
  const stack: Array<[number, number]> = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== orig) continue;
    grid[r]![c] = newColor;
    hooks.onFill?.(r, c);
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  hooks.onResult?.(grid);
  return grid;
}

// 泛洪填充 · 实现

export interface FloodHooks {
  onFill?: (r: number, c: number, oldColor: number, newColor: number) => void;
}

/** DFS 泛洪填充。原地修改 image。 */
export function floodFill(
  image: number[][],
  sr: number,
  sc: number,
  newColor: number,
  hooks: FloodHooks = {},
): number[][] {
  const rows = image.length;
  if (rows === 0) return image;
  const cols = image[0]!.length;
  const oldColor = image[sr]![sc]!;
  if (oldColor === newColor) return image;

  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (image[r]![c]! !== oldColor) return;
    image[r]![c] = newColor;
    hooks.onFill?.(r, c, oldColor, newColor);
    dfs(r - 1, c);
    dfs(r + 1, c);
    dfs(r, c - 1);
    dfs(r, c + 1);
  };

  dfs(sr, sc);
  return image;
}

/** 返回新副本而不修改原图。 */
export function floodFillCopy(
  image: number[][],
  sr: number,
  sc: number,
  newColor: number,
  hooks: FloodHooks = {},
): number[][] {
  const copy = image.map((row) => [...row]);
  return floodFill(copy, sr, sc, newColor, hooks);
}

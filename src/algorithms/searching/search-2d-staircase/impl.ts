// 二维矩阵查找（阶梯法）· 纯算法实现
export interface StaircaseHooks {
  onStep?: (r: number, c: number) => void;
}

export function staircaseSearch2D(
  matrix: number[][],
  target: number,
  hooks: StaircaseHooks = {},
): [number, number] {
  const m = matrix.length;
  if (m === 0) return [-1, -1];
  const n = matrix[0]!.length;
  let r = 0,
    c = n - 1;
  while (r < m && c >= 0) {
    hooks.onStep?.(r, c);
    const v = matrix[r]![c]!;
    if (v === target) return [r, c];
    if (v > target) c--;
    else r++;
  }
  return [-1, -1];
}

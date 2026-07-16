// =============================================================================
// 栅栏转置密码 · 纯算法实现
// 4×4 网格。初始孔位选自左上 2×2 的对角线半数：
//   holes(0°)   = (0,0),(0,1),(1,2),(1,3)  这样的模式——但确保 4 次旋转覆盖全 16 格。
// 这里采用经典 Fleissner 栅栏的孔位设计：在每个 2×2 象限取一格，按 90° 旋转后各格互不重叠。
// 我们直接给定 16 位 0/1 模板（每 90° 旋转恰好 4 个 1，4 次覆盖全部 16 格）。
// =============================================================================
const N = 4;

/** 由模板生成 0° 时的孔位列表。模板长度 16，'1' 表示有孔。 */
function holesFromMask(mask: readonly number[]): Array<[number, number]> {
  const holes: Array<[number, number]> = [];
  for (let i = 0; i < N * N; i++) {
    if (mask[i] === 1) holes.push([Math.floor(i / N), i % N]);
  }
  return holes;
}

/** 顺时针旋转 90°： -> (c, N-1-r) */
function rotateCW(holes: ReadonlyArray<readonly [number, number]>): Array<[number, number]> {
  return holes.map(([r, c]) => [c, N - 1 - r]);
}

/** 经典可行掩码：旋转 4 次恰好覆盖全部 16 格。
 *  从 4 个互相旋转的"轨道"中各取一格：(0,0),(0,1),(0,2),(1,1)。
 *  排成行优先 16 位：第 0 行前三位为 1，第 1 行第 1 列为 1。 */
const DEFAULT_MASK = [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export interface GrilleHooks {
  onMask?: (mask: readonly number[]) => void;
  onFill?: (rotation: number, grid: string[][]) => void;
  onConclude?: (result: string) => void;
}

export function grilleEncrypt(
  text: string,
  mask: readonly number[] = DEFAULT_MASK,
  hooks: GrilleHooks = {},
): string {
  const grid: string[][] = Array.from({ length: N }, () => Array<string>(N).fill(''));
  let holes = holesFromMask(mask);
  hooks.onMask?.(mask);
  // 取前 16 个字符（不足补 X）
  const chars = (text + 'XXXXXXXXXXXXXXXX').slice(0, N * N);
  let pos = 0;
  for (let rot = 0; rot < 4; rot++) {
    for (const [r, c] of holes) {
      grid[r]![c] = chars[pos] ?? 'X';
      pos++;
    }
    hooks.onFill?.(rot, grid);
    holes = rotateCW(holes);
  }
  // 按行读出
  let result = '';
  for (let r = 0; r < N; r++) result += grid[r]!.join('');
  hooks.onConclude?.(result);
  return result;
}

// =============================================================================
// 二维峰值查找（2D Peak Find）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

export interface Peak2D {
  row: number;
  col: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface Peak2DHooks {
  /** 取中间列 midCol，并报告该列最大值所在行 maxRow。 */
  onColumn?: (midCol: number, maxRow: number, maxVal: number) => void;
  /** 决定递归方向：'left' | 'right' | 'found'。 */
  onBranch?: (dir: 'left' | 'right' | 'found', midCol: number, maxRow: number) => void;
  /** 完成。 */
  onDone?: (peak: Peak2D) => void;
}

/** 安全取值，越界返回 -Infinity。 */
function get(a: number[][], r: number, c: number): number {
  if (r < 0 || r >= a.length || c < 0 || c >= a[0]!.length) return -Infinity;
  return a[r]![c]!;
}

/**
 * 二维峰值查找：返回矩阵中任意一个峰值的坐标。
 *
 * @param matrix n×m 矩阵（各行同长）
 * @param hooks 可选的事件钩子
 */
export function findPeak2D(matrix: number[][], hooks: Peak2DHooks = {}): Peak2D {
  const n = matrix.length;
  if (n === 0) throw new RangeError('matrix 为空');
  const m = matrix[0]!.length;

  const findMaxRow = (col: number): number => {
    let maxRow = 0;
    for (let r = 1; r < n; r++) {
      if (matrix[r]![col]! > matrix[maxRow]![col]!) maxRow = r;
    }
    return maxRow;
  };

  const solve = (lo: number, hi: number): Peak2D => {
    if (lo > hi) return { row: -1, col: -1 };
    const midCol = (lo + hi) >> 1;
    const maxRow = findMaxRow(midCol);
    const cur = matrix[maxRow]![midCol]!;
    hooks.onColumn?.(midCol, maxRow, cur);

    const left = get(matrix, maxRow, midCol - 1);
    const right = get(matrix, maxRow, midCol + 1);

    if (left > cur) {
      hooks.onBranch?.('left', midCol, maxRow);
      return solve(lo, midCol - 1);
    }
    if (right > cur) {
      hooks.onBranch?.('right', midCol, maxRow);
      return solve(midCol + 1, hi);
    }
    hooks.onBranch?.('found', midCol, maxRow);
    return { row: maxRow, col: midCol };
  };

  const peak = solve(0, m - 1);
  hooks.onDone?.(peak);
  return peak;
}

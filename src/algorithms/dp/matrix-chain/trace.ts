// =============================================================================
// 矩阵连乘 · 录制帧序列
// 用二维 grid 展示 dp 表：行 = 区间起点 i，列 = 区间终点 j。
// 上三角矩阵（i <= j）。当前尝试的 (i,j) 标 'compare'，当前断点 k 标 'frontier'，
// 确定的最优值标 'final'，回溯断点标 'pivot'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matrixChain, type MatrixChainHooks } from './impl.ts';

export const DEFAULT_INPUT: { dims: number[] } = {
  dims: [10, 30, 5, 60], // 3 个矩阵：A1(10×30) A2(30×5) A3(5×60)
};

/** 录制演示帧序列。 */
export function buildTrace(input: { dims: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { dims } = input;
  const n = dims.length - 1; // 矩阵个数

  if (n <= 0) {
    rec.begin({ zh: '无矩阵', en: 'No matrices' }).commit();
    return rec.build();
  }

  // dp 表：(n+1) x (n+1)，未填记 -1；对角线 dp[i][i]=0
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(-1));
  for (let i = 1; i <= n; i++) dp[i]![i] = 0;
  const splitMap: Map<string, number> = new Map(); // "i,j" -> 最佳断点

  let curI = -1;
  let curJ = -1;
  let curK = -1;
  const backtrackSplits = new Set<string>(); // 回溯断点 "i,j"

  /** 渲染带表头的 grid（仅展示上三角）。 */
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：左上角 'i\j' + 各终点 j
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 1; j <= n; j++) header.push({ v: j, role: 'pivot' });
    grid.push(header);
    for (let i = 1; i <= n; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' }];
      for (let j = 1; j <= n; j++) {
        if (j < i) {
          row.push({ v: ' ', role: 'default' }); // 下三角留空
        } else {
          const key = `${i},${j}`;
          let role: BarRole = 'default';
          if (backtrackSplits.has(key)) role = 'pivot';
          else if (curI === i && curJ === j && curK >= 0) role = 'frontier';
          else if (curI === i && curJ === j) role = 'compare';
          const val = dp[i]![j]!;
          row.push({ v: val < 0 ? '·' : val, role });
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const auxMatrices = (): Array<{ label: string; value: string; role?: BarRole }> =>
    Array.from({ length: n }, (_, idx) => ({
      label: `A${idx + 1}`,
      value: `${dims[idx]}×${dims[idx + 1]}`,
      role: 'default',
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxMatrices()).commit();
  };

  snapshot({
    zh: `${n} 个矩阵：${Array.from({ length: n }, (_, i) => `A${i + 1}(${dims[i]}×${dims[i + 1]})`).join(', ')}`,
    en: `${n} matrices: ${Array.from({ length: n }, (_, i) => `A${i + 1}(${dims[i]}×${dims[i + 1]})`).join(', ')}`,
  });

  const hooks: MatrixChainHooks = {
    onTrySplit: (i, j, k, cost) => {
      curI = i;
      curJ = j;
      curK = k;
      snapshot({
        zh: `dp[${i}][${j}]：尝试断点 k=${k}，cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i - 1]}×${dims[k]}×${dims[j]} = ${cost}`,
        en: `dp[${i}][${j}]: try k=${k}, cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i - 1]}×${dims[k]}×${dims[j]} = ${cost}`,
      });
    },
    onSetBest: (i, j, minCost, bestK) => {
      dp[i]![j] = minCost;
      splitMap.set(`${i},${j}`, bestK);
      curK = -1;
      curI = i;
      curJ = j;
      snapshot({
        zh: `确定 dp[${i}][${j}] = ${minCost}（最优断点 k=${bestK}）`,
        en: `Set dp[${i}][${j}] = ${minCost} (best split k=${bestK})`,
      });
    },
    onBacktrack: (i, k, j) => {
      backtrackSplits.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      curK = -1;
      snapshot({
        zh: `回溯：dp[${i}][${j}] 在 k=${k} 处断开`,
        en: `Backtrack: dp[${i}][${j}] splits at k=${k}`,
      });
    },
  };

  const result = matrixChain(dims, hooks);

  // 终态
  curI = -1;
  curJ = -1;
  curK = -1;
  rec
    .begin({
      zh: `最少乘法次数 = ${result.cost}\n最优括号化：${result.parenthesization}`,
      en: `Min multiplications = ${result.cost}\nOptimal: ${result.parenthesization}`,
    })
    .setGrid(renderGrid())
    .setAux([
      ...auxMatrices(),
      { label: '最少次数', value: String(result.cost), role: 'final' },
      { label: '括号化', value: result.parenthesization, role: 'final' },
    ])
    .commit();

  return rec.build();
}

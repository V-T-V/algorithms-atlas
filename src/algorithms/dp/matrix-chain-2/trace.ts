// =============================================================================
// 矩阵链DP2 · 录制帧序列
// 用 setGrid 展示 dp[i][j]，用 setBars 展示各矩阵维度。
// 当前区间标 'compare'，断点标 'pivot'，已确定标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matrixChain2, type MatrixChain2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 30, 5, 60]; // 3 个矩阵：10x30, 30x5, 5x60

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length - 1;
  if (n <= 1) {
    rec.begin({ zh: '矩阵数 <= 1', en: '<=1 matrix' }).commit();
    return rec.build();
  }
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(-1));
  for (let i = 1; i <= n; i++) dp[i]![i] = 0;

  let curI = -1;
  let curJ = -1;
  let curK: number | null = null;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j <= n; j++) header.push({ v: j, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' }];
      for (let j = 0; j <= n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        else if (dp[i]![j] !== undefined && dp[i]![j]! >= 0 && j > i && i >= 1) role = 'final';
        const v = i === 0 || j === 0 || i > j ? ' ' : dp[i]![j]! < 0 ? '·' : dp[i]![j]!;
        row.push({ v, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) labels[i] = `${input[i]}x${input[i + 1]}`;
    const roles: Record<number, BarRole> = {};
    if (curK !== null) roles[curK - 1] = 'pivot';
    rec
      .begin(note)
      .setBars(rec.barsFrom(input.slice(0, n), roles, labels))
      .setGrid(renderGrid())
      .commit();
  };

  snapshot({
    zh: `${n} 个矩阵，维度链 [${input.join(', ')}]`,
    en: `${n} matrices, dims [${input.join(', ')}]`,
  });

  const hooks: MatrixChain2Hooks = {
    onTry: (i, j, k) => {
      curI = i;
      curJ = j;
      curK = k;
    },
    onFill: (i, j, val) => {
      dp[i]![j] = val;
      curK = null;
      curI = i;
      curJ = j;
      snapshot({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
  };

  const ans = matrixChain2(input, hooks);

  curI = -1;
  curJ = -1;
  curK = null;
  rec
    .begin({ zh: `最少乘法次数 = ${ans}`, en: `Min scalar multiplications = ${ans}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

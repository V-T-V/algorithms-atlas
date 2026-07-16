// =============================================================================
// 区间 DP（石子合并）· 录制帧序列
// 用 setGrid 展示 dp[i][j] 表：当前填格 'compare'，最终最优分割 'final'。
// 用 setAux 展示当前区间、分割点与累计最小代价。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalDp, type IntervalDpHooks } from './impl.ts';

/** 演示石子堆。 */
export const DEFAULT_INPUT = [3, 4, 5, 1, 2];

const fmt = (v: number): string | number => (!Number.isFinite(v) ? '∞' : v);

/** 录制演示帧序列。 */
export function buildTrace(stones: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = stones.length;

  // dp 表快照：未填记 -1
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));
  for (let i = 0; i < n; i++) dp[i]![i] = 0;
  const split: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));

  let curI = -1;
  let curJ = -1;
  let curK = -1;
  // 最终回溯路径上用到的格子（区间合并顺序）
  const optimalCells = new Set<string>();

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：j 列
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: `${j}`, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        if (j < i) {
          row.push({ v: '·', role: 'default' });
          continue;
        }
        let role: BarRole = 'default';
        const key = `${i},${j}`;
        if (optimalCells.has(key)) role = 'final';
        if (curI === i && curJ === j) role = 'compare';
        row.push({ v: dp[i]![j]! < 0 ? '·' : dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '石子 / stones', value: stones.join(', '), role: 'default' },
        {
          label: '当前区间 / interval',
          value: curI < 0 ? '—' : `[${curI},${curJ}]`,
          role: 'compare',
        },
        { label: '分割点 / split k', value: curK < 0 ? '—' : String(curK), role: 'frontier' },
        {
          label: '最小代价 / min cost',
          value: dp[0]![n - 1]! >= 0 ? String(dp[0]![n - 1]!) : '?',
          role: 'final',
        },
      ])
      .commit();
  };

  snapshot({ zh: `${n} 堆石子：${stones.join(', ')}`, en: `${n} piles: ${stones.join(', ')}` });

  const hooks: IntervalDpHooks = {
    onEnterInterval: (i, j, len) => {
      curI = i;
      curJ = j;
      curK = -1;
      snapshot({
        zh: `计算区间 [${i},${j}]（长度 ${len}）`,
        en: `Compute interval [${i},${j}] (len ${len})`,
      });
    },
    onTrySplit: (i, j, k, candidate) => {
      curK = k;
      snapshot({
        zh: `[${i},${j}] 试分割点 k=${k}：dp[${i}][${k}]+dp[${k + 1}][${j}]+sum = ${fmt(candidate)}`,
        en: `[${i},${j}] try k=${k}: dp[${i}][${k}]+dp[${k + 1}][${j}]+sum = ${fmt(candidate)}`,
      });
    },
    onSolve: (i, j, value, sp) => {
      dp[i]![j] = value;
      split[i]![j] = sp;
      curK = -1;
      snapshot({
        zh: `dp[${i}][${j}] = ${fmt(value)}（最优分割 k=${sp}）`,
        en: `dp[${i}][${j}] = ${fmt(value)} (best split k=${sp})`,
      });
    },
    onDone: () => {},
  };

  const result = intervalDp(stones, hooks);

  // 标记最优合并顺序涉及的区间（自顶向下回溯 split）
  const markOptimal = (i: number, j: number): void => {
    if (i >= j) return;
    optimalCells.add(`${i},${j}`);
    const k = result.split[i]![j]!;
    if (k < 0) return;
    markOptimal(i, k);
    markOptimal(k + 1, j);
  };
  markOptimal(0, n - 1);

  curI = -1;
  curJ = -1;
  curK = -1;
  rec
    .begin({
      zh: `最小总合并代价 = ${result.minCost}`,
      en: `Minimum merge cost = ${result.minCost}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '最小代价 / min cost', value: String(result.minCost), role: 'final' }])
    .commit();

  return rec.build();
}

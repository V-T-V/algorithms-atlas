// =============================================================================
// 戳气球 · 录制帧序列
// 用二维 grid 展示 dp 表（开区间 (i,j)），当前填格标 'compare'，
// 选中的 k 标 'frontier'，最优 dp 值标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { burstBalloons, type BurstBalloonsHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 5, 8];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }
  const a: number[] = [1, ...input, 1];
  const m = a.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(m).fill(-1));
  for (let i = 0; i < m; i++) dp[i]![i] = 0; // 长度 0 区间
  for (let i = 0; i + 1 < m; i++) dp[i]![i + 1] = 0; // 长度 1 区间（无气球）

  let curI = -1;
  let curJ = -1;
  let bestK: number | null = null;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: '(i,j)', role: 'default' }];
    for (let j = 0; j < m; j++) header.push({ v: a[j]!, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: a[i]!, role: 'pivot' }];
      for (let j = 0; j < m; j++) {
        let role: BarRole = 'default';
        if (curI === i && curJ === j) role = 'compare';
        else if (bestK !== null && i === curI && j === curJ) role = 'frontier';
        const val = dp[i]![j]!;
        row.push({ v: val < 0 ? '·' : val, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snapshot({
    zh: `气球 [${input.join(', ')}]，两端加哨兵 1`,
    en: `Balloons [${input.join(', ')}] with sentinel 1`,
  });

  const hooks: BurstBalloonsHooks = {
    onChooseLast: (i, j, k, gain) => {
      curI = i;
      curJ = j;
      bestK = k;
      snapshot({
        zh: `区间 (${i},${j})：若最后戳 ${k}（值 ${a[k]}），收益 = ${gain}`,
        en: `(${i},${j}): last burst ${k} (val ${a[k]}) → gain ${gain}`,
      });
    },
    onFillCell: (i, j, val) => {
      bestK = null;
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snapshot({
        zh: `dp[${i}][${j}] = ${val}`,
        en: `dp[${i}][${j}] = ${val}`,
      });
    },
  };

  const ans = burstBalloons(input, hooks);

  curI = -1;
  curJ = -1;
  bestK = null;
  rec
    .begin({ zh: `最大硬币数 = ${ans}`, en: `Max coins = ${ans}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

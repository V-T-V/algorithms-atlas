// =============================================================================
// 四边形不等式DP · 录制帧序列
// 用 setBars 展示石子堆，用 setGrid 展示 dp[i][j]。
// 当前合并区间标 'compare'，断点标 'pivot'，已确定区间标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knuthDp, type KnuthDpHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 3, 1, 5, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  if (n <= 1) {
    rec.begin({ zh: '堆数 <= 1，无需合并', en: '<=1 heap, no merge needed' }).commit();
    return rec.build();
  }
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));
  for (let i = 0; i < n; i++) dp[i]![i] = 0;

  let curI = -1;
  let curJ = -1;
  let curK: number | null = null;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) {
      for (let i = curI; i <= curJ; i++) roles[i] = 'compare';
      if (curK !== null) roles[curK] = 'pivot';
    }
    return rec.barsFrom(input, roles);
  };

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        else if (dp[i]![j]! >= 0 && j > i) role = 'final';
        row.push({ v: i > j ? ' ' : dp[i]![j]! < 0 ? '·' : dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setBars(renderBars()).setGrid(renderGrid()).commit();
  };

  snapshot({ zh: `石子堆 [${input.join(', ')}]`, en: `Heaps [${input.join(', ')}]` });

  const hooks: KnuthDpHooks = {
    onSolve: (i, j) => {
      curI = i;
      curJ = j;
      curK = null;
      snapshot({ zh: `合并区间 [${i}, ${j}]`, en: `Merge interval [${i}, ${j}]` });
    },
    onTry: (i, j, k) => {
      curI = i;
      curJ = j;
      curK = k;
    },
    onFill: (i, j, val) => {
      dp[i]![j] = val;
      curK = null;
      snapshot({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
  };

  const ans = knuthDp(input, hooks);

  curI = -1;
  curJ = -1;
  curK = null;
  rec
    .begin({ zh: `最小总代价 = ${ans}`, en: `Min total cost = ${ans}` })
    .setBars(input.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setGrid(renderGrid())
    .commit();

  return rec.build();
}

// =============================================================================
// 取石子 · 录制帧序列
// 用 setBars 展示石子堆（高亮当前区间两端），用 setGrid 展示 dp[i][j]。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame, type StoneGameHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 7, 10];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));
  for (let i = 0; i < n; i++) dp[i]![i] = input[i]!;

  let curI = -1;
  let curJ = -1;
  let pickSide: 'left' | 'right' | null = null;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) {
      roles[curI] = pickSide === 'left' ? 'pivot' : 'compare';
      roles[curJ] = pickSide === 'right' ? 'pivot' : 'compare';
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

  snapshot({ zh: `石子堆 [${input.join(', ')}]`, en: `Piles [${input.join(', ')}]` });

  const hooks: StoneGameHooks = {
    onChoose: (i, j, side) => {
      curI = i;
      curJ = j;
      pickSide = side;
      snapshot({
        zh: `区间 [${i}, ${j}]：先手选${side === 'left' ? '左端' : '右端'}（${input[side === 'left' ? i : j]}）`,
        en: `Interval [${i}, ${j}]: pick ${side} (${input[side === 'left' ? i : j]})`,
      });
    },
    onFill: (i, j, val) => {
      dp[i]![j] = val;
      pickSide = null;
      snapshot({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
  };

  const ans = stoneGame(input, hooks);
  const total = input.reduce((s, x) => s + x, 0);

  curI = -1;
  curJ = -1;
  pickSide = null;
  rec
    .begin({
      zh: `先手最大 = ${ans}（后手 ${total - ans}）`,
      en: `First player max = ${ans} (second ${total - ans})`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setGrid(renderGrid())
    .commit();

  return rec.build();
}

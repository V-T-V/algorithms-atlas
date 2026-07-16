// =============================================================================
// 骰子求和 · 录制帧序列
// 用 setGrid 展示 dp[i][s]（行=骰子数，列=和），当前填格标 'compare'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numberOfDice, type NumberOfDiceHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 2, faces: 6, target: 7 };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { n: number; faces: number; target: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, faces, target } = input;

  const dp: number[][] = [];
  for (let i = 0; i <= n; i++) dp.push(new Array<number>(target + 1).fill(-1));
  dp[0]![0] = 1;

  let curI = -1;
  let curS = -1;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'i\ s', role: 'default' }];
    for (let s = 0; s <= target; s++)
      header.push({ v: s === target ? `s=${s}*` : s, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: `i=${i}`, role: 'pivot' }];
      for (let s = 0; s <= target; s++) {
        let role: BarRole = 'default';
        if (i === curI && s === curS) role = 'compare';
        else if (i === n && s === target && dp[i]![s]! >= 0) role = 'final';
        row.push({ v: dp[i]![s]! < 0 ? '·' : dp[i]![s]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snapshot({
    zh: `${n} 个 ${faces} 面骰子，目标和 ${target}`,
    en: `${n} dice of ${faces} faces, target ${target}`,
  });

  const hooks: NumberOfDiceHooks = {
    onFill: (i, s, val) => {
      dp[i]![s] = val;
      curI = i;
      curS = s;
      snapshot({ zh: `dp[${i}][${s}] = ${val}`, en: `dp[${i}][${s}] = ${val}` });
    },
  };

  const ans = numberOfDice(n, faces, target, hooks);
  void ans;

  curI = -1;
  curS = -1;
  rec
    .begin({ zh: `方案数 = ${ans}`, en: `Ways = ${ans}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

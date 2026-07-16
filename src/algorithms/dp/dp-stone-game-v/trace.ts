// =============================================================================
// 石子游戏 V · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGameV, type StoneGameVHooks } from './impl.ts';

export const DEFAULT_INPUT = [6, 2, 3, 4, 5, 5];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));
  let curI = -1;
  let curJ = -1;
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i\\j', role: 'pivot' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        else if (i === 0 && j === n - 1 && ans > 0) role = 'final';
        const v = dp[i]![j]!;
        row.push({ v: v < 0 ? '·' : `${v}`, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `stones=[${input.join(', ')}]`, en: `stones=[${input.join(', ')}]` });

  const hooks: StoneGameVHooks = {
    onFill: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      curI = -1;
      curJ = -1;
      snap({ zh: `最大得分 = ${t}`, en: `Max score = ${t}` });
    },
  };

  const result = stoneGameV(input, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '得分 / score', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

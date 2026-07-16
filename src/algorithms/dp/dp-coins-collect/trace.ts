// =============================================================================
// 网格收集金币 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinsCollect, type CoinsCollectHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [
  [1, 3, 1, 2],
  [2, 1, 4, 1],
  [5, 2, 1, 3],
];

export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const m = input.length;
  const n = m > 0 ? input[0]!.length : 0;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curI = -1;
  let curJ = -1;
  const pathSet = new Set<string>();

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (pathSet.has(`${i},${j}`)) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        const v = dp[i]![j]!;
        row.push({ v: v < 0 ? `${input[i]![j]!}` : `${input[i]![j]!}/${v}`, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 网格收集金币`, en: `${m}×${n} grid coins collect` });

  const hooks: CoinsCollectHooks = {
    onFill: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
    onPath: (i, j) => {
      pathSet.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      snap({ zh: `路径经过 (${i},${j})`, en: `Path through (${i},${j})` });
    },
    onResult: (t) => snap({ zh: `最大金币 = ${t}`, en: `Max coins = ${t}` }),
  };

  const result = coinsCollect(input, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大金币 / max', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

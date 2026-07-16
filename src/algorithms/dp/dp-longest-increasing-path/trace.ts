// =============================================================================
// 矩阵最长递增路径 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestIncreasingPath, type LipHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [9, 9, 4],
  [6, 6, 8],
  [2, 1, 1],
];

export function buildTrace(input: ReadonlyArray<readonly number[]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const m = input.length;
  const n = m > 0 ? input[0]!.length : 0;
  const memo: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let curI = -1;
  let curJ = -1;
  let best = 0;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        else if (memo[i]![j]! === best && best > 0) role = 'final';
        else if (memo[i]![j]! > 0) role = 'frontier';
        row.push({ v: `${input[i]![j]!}\n(${memo[i]![j]! || '·'})`, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '当前最优', value: String(best), role: 'final' }])
      .commit();
  };

  snap({ zh: `${m}×${n} 矩阵`, en: `${m}x${n} matrix` });

  const hooks: LipHooks = {
    onVisit: (i, j, len) => {
      memo[i]![j] = len;
      curI = i;
      curJ = j;
      if (len > best) best = len;
      snap({ zh: `(${i},${j}) 最长路径 = ${len}`, en: `(${i},${j}) longest = ${len}` });
    },
    onResult: (m2) => {
      best = m2;
      curI = -1;
      curJ = -1;
      snap({ zh: `最长递增路径 = ${m2}`, en: `Longest increasing path = ${m2}` });
    },
  };

  longestIncreasingPath(input, hooks);

  rec
    .begin({ zh: `完成：${best}`, en: `Done: ${best}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(best), role: 'final' }])
    .commit();

  return rec.build();
}

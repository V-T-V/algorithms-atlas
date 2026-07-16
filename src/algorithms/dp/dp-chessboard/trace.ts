// =============================================================================
// 棋盘路径计数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chessboardPaths, type ChessboardHooks } from './impl.ts';

export const DEFAULT_M = 4;
export const DEFAULT_N = 4;

export function buildTrace(m: number = DEFAULT_M, n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let curI = -1;
  let curJ = -1;
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (curI === i && curJ === j) role = 'compare';
        else if (i === m - 1 && j === n - 1 && ans > 0) role = 'final';
        row.push({ v: dp[i]![j]! > 0 ? `${dp[i]![j]}` : '·', role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 棋盘路径计数`, en: `${m}×${n} chessboard paths` });

  const hooks: ChessboardHooks = {
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
      snap({ zh: `路径数 = ${t}`, en: `Paths = ${t}` });
    },
  };

  const result = chessboardPaths(m, n, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '路径数 / paths', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// 最小路径和 · 录制
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minPathSumObstacle, type MinPathHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  grid: [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ],
  blocked: [
    [false, false, false],
    [false, true, false],
    [false, false, false],
  ],
};

export function buildTrace(
  input: { grid: number[][]; blocked?: boolean[][] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { grid, blocked } = input;
  const m = grid.length;
  const n = grid[0]!.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity));
  let cur = { i: 0, j: 0 };

  const snap = (note: { zh: string; en: string }): void => {
    const g: Cell[][] = grid.map((row, i) =>
      row.map((v, j) => {
        const bl = !!blocked?.[i]?.[j];
        const isCur = i === cur.i && j === cur.j;
        return {
          v: bl ? 'X' : `${v}|${Number.isFinite(dp[i]![j]!) ? dp[i]![j]! : '∞'}`,
          role: bl ? 'warn' : isCur ? 'compare' : 'default',
        };
      }),
    );
    rec.begin(note).setGrid(g).commit();
  };

  snap({ zh: `${m}×${n} 网格`, en: `${m}x${n} grid` });

  const hooks: MinPathHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      cur = { i, j };
      snap({
        zh: `dp[${i}][${j}]=${Number.isFinite(val) ? val : '∞'}`,
        en: `dp[${i}][${j}]=${Number.isFinite(val) ? val : 'inf'}`,
      });
    },
  };

  const ans = minPathSumObstacle(grid, blocked, hooks);

  rec
    .begin({ zh: `最小路径和=${ans}`, en: `Min path sum=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

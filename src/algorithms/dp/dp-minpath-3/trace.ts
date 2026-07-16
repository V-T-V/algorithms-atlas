import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minPathSum, type MinPathHooks } from './impl.ts';

export const DEFAULT_GRID = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];

export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  let ci = -1,
    cj = -1;
  rec
    .begin({
      zh: `${grid.length}×${grid[0]!.length} 网格`,
      en: `${grid.length}x${grid[0]!.length} grid`,
    })
    .setGrid(grid.map((row) => row.map((v) => ({ v: String(v), role: 'default' as BarRole }))))
    .commit();
  const hooks: MinPathHooks = {
    onCell: (i, j, val) => {
      grid[i]![j] = val;
      ci = i;
      cj = j;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setGrid(
          grid.map((row, r) =>
            row.map((v, c) => ({
              v: String(v),
              role: (r === ci && c === cj ? 'compare' : 'default') as BarRole,
            })),
          ),
        )
        .commit();
    },
  };
  const ans = minPathSum(grid, hooks);
  rec
    .begin({ zh: `最小路径和=${ans}`, en: `Min path sum=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}

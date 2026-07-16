// =============================================================================
// 路径计数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countPaths, type CountPathsHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 4, n: 4 };

export function buildTrace(input: { m: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { m, n } = input;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let curI = -1;
  let curJ = -1;
  let total = 0;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === curI && j === curJ) role = 'compare';
        if (i === m - 1 && j === n - 1 && total > 0) role = 'final';
        row.push({ v: dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 网格路径计数`, en: `${m}x${n} grid path counting` });

  const hooks: CountPathsHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      if (i === 0 || j === 0) {
        snap({ zh: `dp[0][${j}] = 1（边界）`, en: `dp[0][${j}] = 1 (boundary)` });
      } else {
        snap({
          zh: `dp[${i}][${j}] = ${dp[i - 1]![j]!}+${dp[i]![j - 1]!} = ${val}`,
          en: `dp[${i}][${j}] = ${dp[i - 1]![j]!}+${dp[i]![j - 1]!} = ${val}`,
        });
      }
    },
    onResult: (t) => {
      total = t;
      curI = -1;
      curJ = -1;
      snap({ zh: `共 ${t} 条路径`, en: `${t} paths total` });
    },
  };

  countPaths(m, n, hooks);

  rec
    .begin({ zh: `完成：${total} 条路径`, en: `Done: ${total} paths` })
    .setGrid(renderGrid())
    .setAux([{ label: '路径数', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// 欧拉数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerianTriangle, type EulerNumberHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 6 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const grid: Array<Array<string | number | undefined>> = [];
  for (let r = 0; r <= N; r++) {
    const row: Array<string | number | undefined> = [];
    for (let c = 0; c < N; c++) row.push(undefined);
    grid.push(row);
  }

  rec
    .begin({ zh: `构造欧拉数三角（0..${N}）`, en: `Build Eulerian triangle (0..${N})` })
    .setGrid(rec.gridFrom(grid))
    .commit();

  const hooks: EulerNumberHooks = {
    onRow: (n, row) => {
      for (let k = 0; k < row.length; k++) {
        grid[n]![k] = row[k];
      }
      rec
        .begin({
          zh: `第 ${n} 行：[${row.join(', ')}]，行和 = ${row.reduce((a, b) => a + b, 0)}`,
          en: `Row ${n}: [${row.join(', ')}], sum = ${row.reduce((a, b) => a + b, 0)}`,
        })
        .setGrid(rec.gridFrom(grid))
        .commit();
    },
  };

  eulerianTriangle(N, hooks);

  rec
    .begin({ zh: `完成欧拉数三角`, en: `Done Eulerian triangle` })
    .setGrid(rec.gridFrom(grid))
    .commit();

  return rec.build();
}

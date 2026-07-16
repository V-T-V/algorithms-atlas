// =============================================================================
// Catalan 三角 · 录制帧序列
// 用 setGrid 展示三角表，逐行填充。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalanTriangle, type CatalanTriangleHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 6 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  // 构造 (N+1)x(N+1) 网格，空格用空串
  const grid: Cell[][] = [];
  for (let r = 0; r <= N; r++) {
    const row: Cell[] = [];
    for (let c = 0; c <= N; c++) row.push({ v: undefined, role: 'default' });
    grid.push(row);
  }

  rec
    .begin({ zh: `构造 Catalan 三角（0..${N}）`, en: `Build Catalan triangle (0..${N})` })
    .setGrid(grid)
    .commit();

  const hooks: CatalanTriangleHooks = {
    onRow: (n, row) => {
      for (let k = 0; k <= n; k++) {
        grid[n]![k] = { v: row[k], role: (k === n ? 'final' : 'default') as BarRole };
      }
      // 清掉未来行
      rec
        .begin({
          zh: `第 ${n} 行：[${row.join(', ')}]；C_${n} = ${row[n] ?? 1}`,
          en: `Row ${n}: [${row.join(', ')}]; C_${n} = ${row[n] ?? 1}`,
        })
        .setGrid(grid)
        .commit();
    },
  };

  const { catalan } = catalanTriangle(N, hooks);

  rec
    .begin({
      zh: `完成：Catalan 序列 = [${catalan.join(', ')}]`,
      en: `Done: Catalan = [${catalan.join(', ')}]`,
    })
    .setGrid(grid)
    .setAux([{ label: 'C_n', value: catalan.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}

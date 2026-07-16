// =============================================================================
// Delannoy 数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delannoyTable, type DelannoyHooks } from './impl.ts';

export const DEFAULT_INPUT: { M: number; N: number } = { M: 5, N: 5 };

export function buildTrace(input: { M: number; N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { M, N } = input;

  const grid: Array<Array<string | number | undefined>> = [];
  for (let r = 0; r <= M; r++) {
    const row: Array<string | number | undefined> = [];
    for (let c = 0; c <= N; c++) row.push(undefined);
    grid.push(row);
  }

  rec
    .begin({ zh: `构造 Delannoy 表 (${M}×${N})`, en: `Build Delannoy table (${M}×${N})` })
    .setGrid(rec.gridFrom(grid))
    .commit();

  let lastM = 0;
  let lastN = 0;
  const hooks: DelannoyHooks = {
    onCell: (m, n, value) => {
      grid[m]![n] = value.toString();
      lastM = m;
      lastN = n;
      // 仅在完成一行后发一帧
      if (n === N) {
        rec
          .begin({ zh: `第 ${m} 行完成`, en: `Row ${m} done` })
          .setGrid(rec.gridFrom(grid))
          .commit();
      }
    },
  };

  const table = delannoyTable(M, N, hooks);
  void lastM;
  void lastN;

  rec
    .begin({ zh: `D(${M},${N}) = ${table[M]![N]}`, en: `D(${M},${N}) = ${table[M]![N]}` })
    .setGrid(rec.gridFrom(grid))
    .setAux([{ label: `D(${M},${N})`, value: table[M]![N]!.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

// =============================================================================
// Narayana 数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { narayanaTriangle, type NarayanaHooks } from './impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 6 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const grid: Array<Array<string | number | undefined>> = [];
  for (let r = 0; r <= N; r++) {
    const row: Array<string | number | undefined> = [];
    for (let c = 0; c <= N; c++) row.push(undefined);
    grid.push(row);
  }

  rec
    .begin({ zh: `构造 Narayana 三角（1..${N}）`, en: `Build Narayana triangle (1..${N})` })
    .setGrid(rec.gridFrom(grid))
    .commit();

  const catalan: bigint[] = [];
  const hooks: NarayanaHooks = {
    onRow: (n, row) => {
      const sum = row.reduce((a, b) => a + b, 0n);
      catalan.push(sum);
      for (let k = 0; k < row.length; k++) {
        grid[n]![k + 1] = row[k]!.toString();
      }
      rec
        .begin({
          zh: `第 ${n} 行：[${row.map((x) => x.toString()).join(', ')}]，行和 = ${sum}（= C_${n}）`,
          en: `Row ${n}: [${row.map((x) => x.toString()).join(', ')}], sum = ${sum} (= C_${n})`,
        })
        .setGrid(rec.gridFrom(grid))
        .commit();
    },
  };

  narayanaTriangle(N, hooks);

  rec
    .begin({
      zh: `完成；Catalan 行和 = [${catalan.map((c) => c.toString()).join(', ')}]`,
      en: `Done; Catalan row sums = [${catalan.map((c) => c.toString()).join(', ')}]`,
    })
    .setGrid(rec.gridFrom(grid))
    .commit();

  return rec.build();
}

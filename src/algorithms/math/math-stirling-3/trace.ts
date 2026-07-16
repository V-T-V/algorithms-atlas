// =============================================================================
// Stirling · 录制
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirling2, type StirlingHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, k: 3 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const dp: bigint[][] = Array.from({ length: input.n + 1 }, () => new Array(input.k + 1).fill(0n));
  let cur = { i: 0, j: 0 };

  const snap = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = dp.map((row, i) =>
      row.map((v, j) => ({
        v: v === 0n ? '.' : v.toString(),
        role: i === cur.i && j === cur.j ? 'compare' : 'default',
      })),
    );
    rec.begin(note).setGrid(grid).commit();
  };

  snap({ zh: `求 S(${input.n}, ${input.k})`, en: `S(${input.n}, ${input.k})` });

  const hooks: StirlingHooks = {
    onCell: (i, j, v) => {
      dp[i]![j] = v;
      cur = { i, j };
      snap({ zh: `S(${i},${j})=${v}`, en: `S(${i},${j})=${v}` });
    },
  };

  const ans = stirling2(input.n, input.k, hooks);

  rec
    .begin({ zh: `S(${input.n},${input.k})=${ans}`, en: `S(${input.n},${input.k})=${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}

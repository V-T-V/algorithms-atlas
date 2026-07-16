// Sattolo 算法（随机环排列）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sattoloCycle, isSingleCycle } from './impl.ts';

export const DEFAULT_INPUT = { n: 8 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const init = Array.from({ length: input.n }, (_, i) => i);

  rec
    .begin({ zh: `Sattolo 环排列（n=${input.n}）`, en: `Sattolo cycle (n=${input.n})` })
    .setBars(init.map((v) => ({ value: v, role: 'pivot' as BarRole })))
    .commit();

  const hooks = {
    onSwap: (i: number, j: number, arr: number[]) => {
      const roles: Record<number, BarRole> = { [i]: 'swap', [j]: 'swap' };
      rec
        .begin({ zh: `i=${i} ↔ j=${j}`, en: `i=${i} ↔ j=${j}` })
        .setBars(arr.map((v, idx) => ({ value: v, role: roles[idx] ?? 'default' })))
        .commit();
    },
  };

  const result = sattoloCycle(input.n, undefined, hooks);
  const cycle = isSingleCycle(result);

  rec
    .begin({ zh: cycle ? '构成单环' : '非单环', en: cycle ? 'Single cycle' : 'Not a single cycle' })
    .setBars(result.map((v) => ({ value: v, role: (cycle ? 'final' : 'warn') as BarRole })))
    .setAux([{ label: '单环', value: String(cycle), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

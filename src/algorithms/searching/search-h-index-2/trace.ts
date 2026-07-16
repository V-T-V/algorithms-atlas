import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hIndex2, type HIndex2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 6, 1, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => b - a);
  rec
    .begin({ zh: `引用数降序：[${sorted.join(',')}]`, en: `Citations desc: [${sorted.join(',')}]` })
    .setBars(rec.barsFrom(sorted))
    .commit();
  const hooks: HIndex2Hooks = {
    onStep: (i, value) => {
      const roles: Record<number, BarRole> = { [i]: 'compare' };
      for (let k = 0; k < i; k++) roles[k] = 'final';
      rec
        .begin({
          zh: `citations[${i}]=${value} >= ${i + 1}?`,
          en: `citations[${i}]=${value} >= ${i + 1}?`,
        })
        .setBars(rec.barsFrom(sorted, roles))
        .commit();
    },
  };
  const r = hIndex2(input, hooks);
  rec
    .begin({ zh: `H 指数 = ${r}`, en: `H-index = ${r}` })
    .setBars(rec.barsFrom(sorted))
    .setAux([{ label: 'h-index', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

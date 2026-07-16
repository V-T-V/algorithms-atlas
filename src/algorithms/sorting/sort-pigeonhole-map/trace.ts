import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pigeonholeSortMap, type PigeonholeMapHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const counts: Record<number, number> = {};
  const hooks: PigeonholeMapHooks = {
    onPlace: (hole) => {
      counts[hole] = (counts[hole] ?? 0) + 1;
      const aux = Object.keys(counts).map((k) => ({
        label: `hole ${k}`,
        value: String(counts[+k]),
      }));
      rec
        .begin({ zh: `放入鸽巢 ${hole}`, en: `Place into hole ${hole}` })
        .setAux(aux)
        .commit();
    },
  };
  const result = pigeonholeSortMap(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}

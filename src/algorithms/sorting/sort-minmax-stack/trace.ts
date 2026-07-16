import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minmaxStackSort, type MinMaxStackHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MinMaxStackHooks = {
    onSelect: (minV, maxV, arr) => {
      const roles: Record<number, BarRole> = {};
      rec
        .begin({
          zh: `选 min=${minV}, max=${maxV} 放两端`,
          en: `Pick min=${minV}, max=${maxV} to ends`,
        })
        .setBars(
          arr.map((v) => ({
            value: v || 0,
            role: (v === undefined ? 'default' : 'frontier') as BarRole,
          })),
        )
        .commit();
    },
  };
  const result = minmaxStackSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}

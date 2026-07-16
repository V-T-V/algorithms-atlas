// 两城调度 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyTwoCityScheduling, type GreedyTwoCitySchedulingHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly [number, number]> = [
  [10, 20],
  [30, 200],
  [400, 50],
  [30, 20],
];

export function buildTrace(
  input: ReadonlyArray<readonly [number, number]> = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 人两城调度`, en: `${input.length} people two-city scheduling` })
    .setBars(input.map((c) => ({ value: c[0] - c[1], role: 'default' as BarRole })))
    .setAux([{ label: 'n', value: String(input.length / 2), role: 'pivot' }])
    .commit();

  const hooks: GreedyTwoCitySchedulingHooks = {
    onAssign: (person, city, cost) => {
      rec
        .begin({
          zh: `人 ${person} → 城 ${city}（费用 ${cost}）`,
          en: `person ${person} → city ${city} (cost ${cost})`,
        })
        .setAux([{ label: 'city', value: city, role: city === 'A' ? 'compare' : 'warn' }])
        .commit();
    },
  };

  const result = greedyTwoCityScheduling(input, hooks);

  rec
    .begin({ zh: `完成：总费用 ${result}`, en: `Done: total cost ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '总费用', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

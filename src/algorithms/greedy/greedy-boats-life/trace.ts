// 救生艇 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyBoatsLife, type GreedyBoatsLifeHooks } from './impl.ts';

export const DEFAULT_INPUT = { people: [3, 2, 2, 1], limit: 3 };

export function buildTrace(input: { people: number[]; limit: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { people, limit } = input;

  rec
    .begin({
      zh: `${people.length} 人，限重 ${limit}`,
      en: `${people.length} people, limit ${limit}`,
    })
    .setBars(people.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyBoatsLifeHooks = {
    onPair: (light, heavy, together) => {
      rec
        .begin({
          zh: `${together ? `配对 ${light}+${heavy}` : `${heavy} 独占`} → 一船`,
          en: `${together ? `pair ${light}+${heavy}` : `${heavy} alone`} → boat`,
        })
        .setBars([{ value: heavy, role: (together ? 'final' : 'warn') as BarRole }])
        .commit();
    },
  };

  const result = greedyBoatsLife(people, limit, hooks);

  rec
    .begin({ zh: `完成：${result} 船`, en: `Done: ${result} boats` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '船数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycle, type Model, type Intent } from './impl.ts';
const intents: Intent[] = [
  { type: 'inc', payload: 1 },
  { type: 'inc', payload: 5 },
  { type: 'dec', payload: 2 },
];
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MVI', en: 'MVI' }).commit();
  let m: Model = { count: 0 };
  for (const i of intents) {
    m = cycle(m, i, {
      onIntent: (it) =>
        rec
          .begin({ zh: 'intent ' + it.type + '+' + it.payload, en: 'intent' })
          .setAux([{ label: 'type', value: it.type, role: 'compare' as BarRole }])
          .commit(),
      onView: (v) =>
        rec
          .begin({ zh: 'view ' + v, en: 'view' })
          .setAux([{ label: 'view', value: v, role: 'final' as BarRole }])
          .commit(),
    }).model;
  }
  rec
    .begin({ zh: '终态 ' + m.count, en: 'final' })
    .setAux([{ label: 'count', value: String(m.count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

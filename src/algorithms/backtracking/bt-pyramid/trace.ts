import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pyramidTransition } from './impl.ts';
export const DEFAULT_INPUT = { bottom: 'BCD', allowed: ['BCG', 'CDE', 'GEA', 'FFF'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '金字塔底 "' + input.bottom + '"', en: 'Pyramid bottom ' + input.bottom })
    .commit();
  const ok = pyramidTransition(input.bottom, input.allowed, {
    onPick: (ch) =>
      rec
        .begin({ zh: '上 ' + ch, en: 'top ' + ch })
        .setAux([{ label: 'top', value: ch, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可建？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

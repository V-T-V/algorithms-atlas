import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sssEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0, 1, 2, 3, 7], start: 2, step: 1, stop: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SSS ' + input.start + '/' + input.step + '/' + input.stop, en: 'SSS' }).commit();
  const code = sssEncode(input.values, input.start, input.step, input.stop, {
    onEmit: (n, c) =>
      rec
        .begin({ zh: n + ' -> ' + c, en: n + '->' + c })
        .setAux([
          { label: 'n', value: String(n), role: 'compare' as BarRole },
          { label: 'code', value: c, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '码流 ' + code, en: 'stream' })
    .setAux([{ label: 'code', value: code, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

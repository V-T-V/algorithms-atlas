import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pforDeltaEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [1, 2, 3, 300, 4, 5, 1000], b: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PFor b=' + input.b, en: 'PFor b=' + input.b }).commit();
  const { core, exc } = pforDeltaEncode(input.values, input.b, {
    onBlock: (bb, n) =>
      rec
        .begin({ zh: '异常 #' + n, en: 'exc' })
        .setAux([{ label: 'exc', value: '#' + n, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'core [' + core.join(',') + '] 异常 ' + exc.length, en: 'result' })
    .setAux([
      { label: 'core', value: core.join(','), role: 'final' as BarRole },
      { label: 'exc', value: String(exc.length), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}

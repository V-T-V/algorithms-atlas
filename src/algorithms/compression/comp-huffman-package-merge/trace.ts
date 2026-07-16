import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { packageMerge } from './impl.ts';
export const DEFAULT_INPUT = { weights: [5, 9, 12, 13, 16, 45], L: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Package-Merge L=' + input.L, en: 'PM L=' + input.L }).commit();
  const lens = packageMerge(input.weights, input.L, {
    onLevel: (l, c) =>
      rec
        .begin({ zh: '层 ' + l + ' ' + c + ' 项', en: 'level' })
        .setAux([
          { label: 'level', value: String(l), role: 'pivot' as BarRole },
          { label: 'items', value: String(c), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '码长 [' + lens.join(',') + ']', en: 'lengths' })
    .setAux([{ label: 'lens', value: lens.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

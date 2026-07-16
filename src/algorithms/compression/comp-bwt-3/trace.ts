import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bwtEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'banana';
  rec
    .begin({ zh: 'BWT', en: 'BWT' })
    .setBars(input.split('').map((c) => ({ value: c.charCodeAt(0), role: 'default' as BarRole })))
    .commit();
  bwtEncode(input, {
    onRotations: (rots) =>
      rec
        .begin({ zh: `${rots.length} 个旋转`, en: `${rots.length} rotations` })
        .setAux([{ label: 'rotations', value: String(rots.length), role: 'compare' as BarRole }])
        .commit(),
    onResult: (r) =>
      rec
        .begin({
          zh: `L='${r.last}' primary=${r.primary}`,
          en: `L='${r.last}' primary=${r.primary}`,
        })
        .setBars(
          r.last.split('').map((c) => ({ value: c.charCodeAt(0), role: 'final' as BarRole })),
        )
        .setAux([{ label: 'primary', value: String(r.primary), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}

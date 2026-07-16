import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitplaneSeparate } from './impl.ts';
export const DEFAULT_INPUT = { pixels: [5, 10, 7, 12], bits: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位平面分离', en: 'Bitplane' }).commit();
  const planes = bitplaneSeparate(input.pixels, input.bits, {
    onPlane: (b, pl) =>
      rec
        .begin({ zh: '位' + b + ': [' + pl.join(',') + ']', en: 'plane' })
        .setAux([
          { label: 'bit', value: String(b), role: 'pivot' as BarRole },
          { label: 'plane', value: pl.join(','), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: planes.length + ' 个平面', en: 'planes' })
    .setAux([{ label: 'planes', value: String(planes.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

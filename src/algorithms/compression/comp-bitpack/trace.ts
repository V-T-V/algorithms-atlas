import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitPack, bitUnpack } from './impl.ts';
export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], width: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位打包 width=' + input.width, en: 'bitpack w=' + input.width }).commit();
  const { bytes, stream } = bitPack(input.values, input.width, {
    onWrite: (v, bits) =>
      rec
        .begin({ zh: v + ' -> ' + bits, en: v + '->' + bits })
        .setAux([{ label: 'bits', value: bits, role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '流 ' + stream, en: 'stream' })
    .setAux([
      { label: 'stream', value: stream, role: 'final' as BarRole },
      { label: 'bytes', value: bytes.join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
